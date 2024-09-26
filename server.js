require("dotenv").config(); // Load dotenv configuration
const { readFileSync } = require("fs");
const { createServer } = require("https");
const { Server } = require("socket.io");
const cors = require("cors"); // Import the cors package
const http = require("http");
const express = require("express");
const app = express();

const watchNotification = require("./DB/watch");

let httpsServer;
let io;
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});
// Check if the environment is production or development
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
    httpsServer = createServer(
        {
            key: readFileSync(process.env.KEY_PATH),
            cert: readFileSync(process.env.CERT_PATH),
        },
        app
    );
    console.log("Production server");
} else {
    httpsServer = createServer(app);
    console.log("Development server");
}

io = new Server(httpsServer, {
   cors: {
    origin: "*", // Your React app URL
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // Allow both WebSocket and polling
});

io.on("connection", (socket) => {
    console.log("A client connected with socket ID:", socket.id);

    socket.on("message", (data) => {
        console.log("Message from client:", data);
        io.emit("message", `${data} , will be resolved soon`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});


watchNotification(io);
const PORT = process.env.PORT || 4009;

httpsServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
