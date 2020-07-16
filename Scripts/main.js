console.info("main.js is being run");
try {
  console.info("Path:", nova.extension.path);
} catch (err) {
  console.error("Couldn't get path, error was:", err.message);
}

try {
  var pathToGoPls = nova.path.join(nova.extension.path, "Scripts/gopls");
  console.info("Constructed path to gopls:", pathToGoPls);
  var serverOptions = {
    path: pathToGoPls,
    type: "stdio",
  };
} catch (err) {
  console.error("could not set path on serverOptions, error was:", err.message);
}

var clientOptions = {
  syntaxes: ["Go"],
};
var client = new LanguageClient(
  "Go",
  "Go (lang) Language Server",
  serverOptions,
  clientOptions
);

try {
  var result = client.start();
  console.info("Client was started; result is", result);
} catch (err) {
  console.error("Couldn't start client, error was:", err.message);
}

// exports.activate = function () {
//   // Do work when the extension is activated
//   console.log("We have been activated!");
//   try {
//     client.start();
//   } catch (err) {
//     console.log(
//       "Couldn't activate client inside callback, error was:",
//       err.message
//     );
//   }
// };
