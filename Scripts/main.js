var serverOptions = {
  path: "Scripts/gopls",
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

console.log("main.js is being run, path is:", Extension.path);

client.start();

exports.activate = function () {
  // Do work when the extension is activated
  console.log("We have been activated!");
  client.start();
};
