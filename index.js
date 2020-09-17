const server = require("./built/server.js");

server.init(process.env.PORT || 3000);