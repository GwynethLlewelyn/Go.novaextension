var serverOptions = {
  path: "Scripts/gopls",
};
var clientOptions = {
  syntaxes: ["go"],
};
var client = new LanguageClient(
  "go",
  "Go (lang) Language Server",
  serverOptions,
  clientOptions
);

client.start();
