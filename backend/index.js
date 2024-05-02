const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const dotenv = require("dotenv");

const port = 5000;
const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // Update with your React app's URL
    methods: ["GET", "POST"],
  },
});
dotenv.config({path: "../.env"});

app.use(cors());

app.get("/game", (req, res) => {
  res.status(200).send("Tic Tac Toe Game Server");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("makeMove", (data) => {
    io.emit("moveMade", data);
  });

  socket.on("resetGame", (newGame) => {
    io.emit("gameReset", newGame);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});