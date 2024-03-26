require("dotenv").config(); // Load dotenv configuration

const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");
const cors = require("cors"); // Import the cors package
const http = require("http");

let httpsServer;
let io;

// Check if the environment is production or development
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
    httpsServer = createServer({
        key: readFileSync(process.env.KEY_PATH),
        cert: readFileSync(process.env.CERT_PATH),
    });
} else {
    httpsServer = http.createServer();
}

io = new Server(httpsServer, {
    cors: {
        origin: process.env.origin,
    },
});

io.on("connection", (socket) => {
    console.log("Server connected");
     // Listen for incoming messages from clients
  socket.on("message", (data) => {
    console.log("Message from client:", data);
    // Broadcast the message to all clients
     io.emit("message", "hello welcome to the team");
  });
});

const PORT = process.env.PORT || 4009;

httpsServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
