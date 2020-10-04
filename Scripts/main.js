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
    };

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
  }

  stop() {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
      this.languageClient = null;
    }
  }

  client() {
    return this.languageClient;
  }
}
