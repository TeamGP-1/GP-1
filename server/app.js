if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const router = require("./routers");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socketHandler");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

socketHandler(io);

module.exports = { app, server };
