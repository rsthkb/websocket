require("dotenv").config(); // Load dotenv configuration
const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");
const cors = require("cors"); // Import the cors package
const http = require("http");
const express = require('express');
const app = express();

const watchNotification = require("./DB/watch");

let httpsServer;
let io;
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
// Check if the environment is production or development
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
    httpsServer = createServer({
        key: readFileSync(process.env.KEY_PATH),
        cert: readFileSync(process.env.CERT_PATH),
    },app);
    console.log("Prodcution server");
} else {
    httpsServer = http.createServer(app);
    console.log("Developement server");
}

io = new Server(httpsServer, {
    cors: {
        origin: process.env.origin,
    },
    path: "/ws/",
});

io.on("connection", (socket) => {
    console.log("Server connected");
    // Listen for incoming messages from clients
    socket.on("message", (data) => {
        console.log("Message from client:", data);
        // Broadcast the message to all clients
        io.emit("message", `${data} , will be resolved soon`);
    });

    socket.on("join", (userId) => {
        console.log("user joined with userId", userId);
        socket.join(userId);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

watchNotification(io);
const PORT = process.env.PORT || 4009;

httpsServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
