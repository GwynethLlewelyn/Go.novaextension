var serverOptions = {
  path: "./gopls",
  type: "stdio",
};
var clientOptions = {
  syntaxes: ["go"],
};
var client = new LanguageClient(
  "Go",
  "Go (lang) Language Server",
  serverOptions,
  clientOptions
);

client.start();
