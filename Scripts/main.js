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
    args: ["-vv", "-rpc.trace", "serve", "-logfile", "/tmp/gopls.log"],
  };
} catch (err) {
  console.error("could not set path on serverOptions, error was:", err.message);
}

var clientOptions = {
  syntaxes: ["Go"],
};
var client = new LanguageClient(
  "Go",
  "gopls", // instructions say: The name parameter is the name of the server that can potentially be shown to the user
  serverOptions,
  clientOptions
);

try {
  client.start();
} catch (err) {
  console.error("Couldn't start server, error was:", err.message);
} finally {
  console.info("Server was started");
}

// post checking:

try {
  if (client.running) {
    console.info("gopls seems to be running");
    console.info(
      "Instance name:",
      client.name,
      "Language identifier:",
      client.identifier
    );
  }
} catch (err) {
  console.error(
    "No clue about why the client cannot communicate with gopls; error was: ",
    err.message
  );
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
