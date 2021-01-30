var lsp = require('lsp.js');
var langserver = null;

exports.activate = function () {
  // Do work when the extension is activated
  langserver = new GoLanguageServer();
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
  if (langserver) {
    langserver.stop();
    langserver = null;
  }
  // shouldn't we remove /tmp/gopls.log? (gwyneth 20210129)
};

class GoLanguageServer {
  constructor() {
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

  start() {
    // Basic server options
    var serverOptions = {
      path: nova.config.get('go-nova.gopls-path', 'string') || 'gopls',
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

    var clientOptions = {
      syntaxes: ['go'],
      initializationOptions: { gopls: {
        "ui.documentation.hoverKind": "SingleLine"
      }
    }
       // does nothing (gwyneth 20210119)
    };

    if (nova.inDevMode()) {
      console.info('gopls client options:', JSON.stringify(clientOptions));
    }

    var client = new LanguageClient(
      'gopls',
      'Go Language Server',
      serverOptions,
      clientOptions
    );

    try {
      client.start();
      nova.subscriptions.add(client);
      this.languageClient = client;
    } catch (err) {
      console.error(err);
    }

    this.commandJump = nova.commands.register('go.jumpToDefinition', jumpToDefinition);
    this.commandOrganizeImports = nova.commands.register('go.organizeImports', organizeImports);
    this.commandFormatFile = nova.commands.register('go.formatFile', formatFile);
  }

  stop() {
    if (this.languageClient) {
      this.commandJump.dispose();
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
      this.languageClient = null;
    }
  }

  client() {
    return this.languageClient;
  }
}

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
  }
}

function formatFile(editor) {
  if (langserver && langserver.client()) {
    var cmd = 'textDocument/formatting';
    var cmdArgs = {
      textDocument: {
        uri: editor.document.uri
      },
      options: {}
    };
    langserver.client().sendRequest(cmd, cmdArgs).then((response) => {
      // console.info(`${cmd} response:`, response);
      if (response !== null && response !== undefined) {
        lsp.ApplyTextEdits(editor, response);
      }
    }).catch(function(err) {
      console.error(`${cmd} error!:`, err);
    });
  }
}

function jumpToDefinition(editor) {
  if (
    langserver === null ||
    langserver.client() === null ||
    langserver.client() === undefined
  ) {
    console.info('gopls language server is not running')
    return
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
    )
    return
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
            console.info('Failed in the jump', err)
          })
      }
    }
  })

}
