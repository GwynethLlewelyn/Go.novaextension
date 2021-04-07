var lsp = require('lsp.js');
var langserver = null;

exports.activate = function () {
  // Do work when the extension is activated
  langserver = new GoLanguageServer();
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
  if (langserver) {
    langserver.deactivate();  // conforming to newer Nova templates
    langserver = null;
  }
  // shouldn't we remove /tmp/gopls.log? (gwyneth 20210129)
  nova.fs.remove('/tmp/gopls.log'); // if it doesn't exist, does nothing (20210130)
};

class GoLanguageServer {
  constructor() {
    // From the new template for extensions using LSP (gwyneth 20210203)
    // Observe the configuration setting for the server's location, and restart the server on change
    nova.config.observe('go-nova.gopls-path', function(path) {
        this.start(path);
    }, this);

    // Handle preference change for enable/disable.
    nova.config.onDidChange(
      'go-nova.enable-gopls',
      function (current, previous) {
        if (current) {
          this.start();
        } else {
          this.stop();
        }
      },
      this
    );

    // Handle preference change for gopls path.
    nova.config.onDidChange(
      'go-nova.gopls-path',
      function (current, previous) {
        // If the user deletes the value in the preferences and presses
        // return or tab, it will revert to the default of 'gopls'.
        // But on the way there, we get called once with with current === null
        // and again with current === previous, both of which we need to ignore.
        if (
          current &&
          current != previous &&
          nova.config.get('go-nova.enable-gopls', 'boolean')
        ) {
          console.info('Restarting gopls due to path change');
          this.stop();
          // Hack: until we can reliably determine when the service is
          // actually stopped, pause a few ticks to already running error.
          setTimeout(() => {
            this.start();
          }, 2000);
        }
      },
      this
    );

    // Start on load, if the preferences say so.
    if (nova.config.get('go-nova.enable-gopls', 'boolean')) {
      this.start();
    }
  }

  deactivate() {
    this.stop();
  }

  start(path) {  // seems that it now requires an extra variable...
    // Check if gopls is already running; this is acording to the new extension template (gwyneth 20210202)
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient); // redundant, .stop() allegedly does this, but that's what we've got on the new template... (gwyneth 20210202)
    }

    // Basic server options
    var serverOptions = {
      path: nova.config.get('go-nova.gopls-path', 'string') || 'gopls' || path,
      args: ['serve'],
    };

    // An absolute path or use the search path?
    if (serverOptions.path.charAt(0) !== '/') {
      serverOptions.args.unshift(serverOptions.path);
      serverOptions.path = '/usr/bin/env';
    }

    if (nova.inDevMode()) {
      serverOptions.args = serverOptions.args.concat([
        '-rpc.trace',
        '-logfile',
        '/tmp/gopls.log',
      ]);
      console.info('gopls server options:', JSON.stringify(serverOptions));
    }

    // Recent versions of Nova can also send initializationOptions. The syntax
    //  is not obvious, because Microsoft and Google use so confusing notations
    //  which are mutually incomprehensible (MS uses TypeScript, Google uses Go).
    // See https://github.com/golang/tools/blob/master/gopls/doc/settings.md
    // (gwyneth 20210131)
    var clientOptions = {
      syntaxes: ['go'],
      initializationOptions: {
        // "hoverKind": "SingleLine", // one of these ought to do the trick
        "hoverKind": "SingleLine",
        // "ui.documentation.hoverKind": "SingleLine", // I know that "SingleLine" works — other options seem to _always_ trigger Markdown (gwyneth 20210202)
        "staticcheck": true, // using staticcheck.io for further analysis (gwyneth 20210406)
//        "ui.completion.usePlaceHolders": true,  // ...whatever this does...
        "usePlaceHolders": true  // trying out which one works (gwyneth 20210203)
      }
    };

    if (nova.inDevMode()) {
      console.info("gopls client options:", JSON.stringify(clientOptions));
    }

    var client = new LanguageClient(
      'gopls',
      'Go Language Server',
      serverOptions,
      clientOptions
    );

    try {
      // Start the client
      client.start();

      // Add the client to the subscriptions to be cleaned up
      nova.subscriptions.add(client);
      this.languageClient = client;
    } catch (err) {
      // If the .start() method throws, it's likely because the path to the language server is invalid
      console.error("Couldn't start the gopls server; please check path. Error was: ", err);
    }

    // Code by @apexskier introduced by @jfieber
    // Registers the commands that can be invoked from the menu as well as the format-on-save
    try {
      this.commandJump = nova.commands.register('go.jumpToDefinition', jumpToDefinition);
      this.commandOrganizeImports = nova.commands.register('go.organizeImports', organizeImports);
      this.commandFormatFile = nova.commands.register('go.formatFile', formatFile);
      // The code below comes from @jfieber (slightly adapted) (gwyneth 20210406)
      this.formatOnSave = nova.workspace.onDidAddTextEditor((editor) => {
        editor.onDidSave(() => {
            console.log('Saved complete');
        });
        editor.onWillSave((editor) => {
            if (editor.document.syntax === 'go') {
                if (nova.config.get('go-nova.format-on-save', 'boolean')) {
                    console.info('Entering FormatOnSave for "' + editor.document.uri + '"...');
                    try {
                      console.group();
                      formatFile(editor);
                      console.groupEnd();                   
                    } catch(err) {
                      console.error("Re-formatting failed miserably");
                    }                    
                }
            }
        }, this);
    }, this);

    } catch(err) {
      console.error("Could not register editor commands: ", err);
    }
  }

  // According to the revised Nova documentation, we should only get a stop() iff the server is still
  //  running; but we nevertheless keep the old code around anyway (gwyneth 20210406)
  stop() {
    if (this.languageClient) {
      try {
        if (this.commandJump && isDisposable(this.commandJump)) {
          this.commandJump.dispose();
        }
        if (this.commandOrganizeImports && isDisposable(this.commandOrganizeImports)) {
          this.commandOrganizeImports.dispose();
        }
        if (this.commandFormatFile && isDisposable(this.commandFormatFile)) {
          this.commandFormatFile.dispose();
        }
        if (this.formatOnSave && isDisposable(this.formatOnSave)) {
          this.formatOnSave.dispose();
        }
      } catch(err) {
        console.error("While stopping, disposing the editor commands failed: ", err);
      }
      try {
        this.languageClient.stop();
        nova.subscriptions.remove(this.languageClient);
        this.languageClient = null;
      } catch (err) {
        console.error("Could not stop languageClient and/or remove it from subscriptions: ", err);
      }
    } else {
      console.error("For some reason, Nova tried to stop a languageClient that wasn't running.");
    }
  }

  client() {
    return this.languageClient;
  }
}

// Code by @apexskier introduced by @jfieber
// This may use some code developed by Microsoft — see [Microsoft Public License (MS-PL)](https://opensource.org/licenses/MS-PL)
function organizeImports(editor) {
  if (langserver && langserver.client()) {
    var cmd = 'textDocument/codeAction';
    var cmdArgs = {
      textDocument: {
        uri: editor.document.uri
      },
      range: lsp.RangeToLspRange(editor.document, editor.selectedRange),
      context: { diagnostics: [] }
    };

    langserver.client().sendRequest(cmd, cmdArgs).then((response) => {
      // console.info(`${cmd} response:`, response);
      if (response !== null && response !== undefined) {
        response.forEach((action) => {
          if (action.kind === "source.organizeImports") {
            console.info(`Performing actions for ${action.kind}`);
            action.edit.documentChanges.forEach((tde) => {
              lsp.ApplyTextDocumentEdit(tde);
            });
          } else {
            console.info(`Skipping action ${action.kind}`);
          }
        });
      }
    }).catch(function(err) {
      console.error(`${cmd} error!:`, err);
    });
  } else {
    console.error("organizeImports() called, but gopls language server is not running");
  }
}

function formatFile(editor) {
  if (langserver && langserver.client()) {
    var cmd = 'textDocument/formatting';
    var cmdArgs = {
      textDocument: {
        uri: editor.document.uri
      },
      options: { // https://github.com/microsoft/language-server-protocol/blob/gh-pages/_specifications/specification-3-17.md#document-formatting-request--leftwards_arrow_with_hook (gwyneth 20210406)
        tabSize: editor.tabLength, 
        insertSpaces: editor.softTabs != 0
      }
    };
    if (nova.inDevMode()) {
      console.info("formatFile(): cmdArgs is ", JSON.stringify(cmdArgs, undefined, 4));
    }
    langserver.client().sendRequest(cmd, cmdArgs).then((response) => {
      if (nova.inDevMode()) {
        console.info(`formatFile(): '${cmd}' response:`, JSON.stringify(response, undefined, 4));
      }
      if (response !== null && response !== undefined && response !== []) {
//        lsp.ApplyTextEdits(editor, response);
        lsp.ApplyTextEditsRevamped(editor, response);  // trying to deal with replace/delete/insert issues (gwyneth 20210406)
      }
    }).catch(function(err) {
      console.error(`formatFile(): ${cmd} error! - `, err);
    });
  } else {
    console.error("formatFile() called, but gopls language server is not running");
  }
}

function jumpToDefinition(editor) {
  if (
    langserver === null ||
    langserver.client() === null ||
    langserver.client() === undefined
  ) {
    console.info("jumpToDefinition() called, but gopls language server is not running");
    return;
  }
  var selectedRange = editor.selectedRange
  selectedPosition =
    (_a = lsp.RangeToLspRange(editor.document, selectedRange)) === null ||
    _a === void 0
      ? void 0
      : _a.start
  if (!selectedPosition) {
    nova.workspace.showWarningMessage(
      "Couldn't figure out what you've selected."
    );
    return;
  }
  var params = {
    textDocument: {
      uri: editor.document.uri,
    },
    position: selectedPosition,
  }
  var jump = langserver.client().sendRequest('textDocument/definition', params)
  // {"uri":"file:///opt/brew/Cellar/go@1.14/1.14.7/libexec/src/fmt/print.go","range":{"start":{"line":272,"character":5},"end":{"line":272,"character":12}}}

  jump.then(function (to) {
    if (to !== null) {
      if (to.length > 0) {
        var target = to[0]
        console.info('Jumping', JSON.stringify(to[0]))
        nova.workspace
          .openFile(target.uri)
          .then(function (targetEditor) {
            // When Nova first opens a file, the callback gets an undefined editor,
            // which is most likely a bug. Usually works the second time.
            if (targetEditor === undefined) {
              console.error('Failed to get TextEditor, will retry')
              nova.workspace
                .openFile(target.uri)
                .then(function (targetEditor) {
                  targetEditor.selectedRange = lsp.LspRangeToRange(
                    targetEditor.document,
                    target.range
                  )
                  targetEditor.scrollToCursorPosition()
                })
                .catch(function (err) {
                  console.error(
                    'Failed to get text editor on the second try',
                    err
                  )
                })
            } else {
              targetEditor.selectedRange = lsp.LspRangeToRange(
                targetEditor.document,
                target.range
              )
              targetEditor.scrollToCursorPosition()
            }
          })
          .catch(function (err) {
            console.info('Failed in the jump', err);
          })
      }
    }
  })
}