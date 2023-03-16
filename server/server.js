const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const app = express();
const port = 8000;
const http = require("http");
require("dotenv").config();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/mongoose.config");
require("./routes/awayMessage.routes")(app);
const UserRoutes = require("./routes/user.routes");
const RoomRoutes = require("./routes/rooms.routes");

RoomRoutes(app);
UserRoutes(app);

const server = app.listen(port, () => console.log("Listening on port", port));

const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true,
    },
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log(" server io ...on");
    console.log("Socket:", socket.id, "connected to the server");

    socket.on("join-room", (data) => {
        console.log("Joined room:", data);
        socket.join(data);
        console.log("USER JOINED", data);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("message_received", data); // emit message to all users in the same room
        console.log(
            "Message sent from ",
            socket.id,
            " in room ",
            data.room,
            " : ",
            data.message
        );
    });

    socket.on("private_message", (data) => {
        console.log("socket private message", data);
        io.to(data.room).emit("private_message_response", data); // emit private message to all users in the same room
        console.log(
            "Private message sent from ",
            socket.id,
            " in room ",
            data.room,
            " : ",
            data.message
        );
    });
});