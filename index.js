import express from "express";
import { configDotenv} from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import watchNotification from "./DB/watch.js";

const app = express();
configDotenv()
let httpsServer ;

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

const io = new Server(httpsServer, {
    cors: {
        origin: "*", // Your React app URL
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"], // Allow both WebSocket and polling
    path: "/ws/", // Ensure the path is correct
});

io.on("connection", (socket) => {
    // ...
    console.log(socket.id, "a client connected with socket");
    socket.on("message", (data) => {
        console.log("received message from client", data);
        io.emit("message", `${data}will be resolved soon`);
    });

    socket.on("disconnect", () => {
        console.log(socket.id, "client disconnected");
    });
});


// Receiving token from the frontend side
io.use((socket,next)=>{
    let token = socket.handshake.auth.token
    console.log(token,"token is being recived")
    next()
})

watchNotification(io)


httpsServer.listen(4009, () => {
    console.log("server is running on the port", 4009);
});
