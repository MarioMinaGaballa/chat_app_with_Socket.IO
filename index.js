const express = require("express");
const { join } = require("node:path");
const { Server } = require("socket.io");

const http = require("http");
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);

    io.emit("send_messages_to_all_clients", msg);
  });
  socket.on("typing", () => {
    socket.broadcast.emit("show_typing_status");
  });
  socket.on("stop_typing", () => {
    socket.broadcast.emit("hide_typing_status");
  });
  socket.on("disconnect", () => {
    console.log("left the chat with id", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
