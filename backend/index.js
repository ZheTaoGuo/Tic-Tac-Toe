const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const dotenv = require("dotenv");

const port = 5000;
const app = express();
const server = http.createServer(app);
const fs = require('fs');

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

let games = [];

try {
  games = JSON.parse(fs.readFileSync("games.json"));
} catch(err) {
  console.log(err)
  games = [];
}

function persist() {
  fs.writeFile(`games.json`, JSON.stringify(games), function(err) {});
}

//Mave a move API
app.get('/make_move/', (req, res) => {
  let gameId = req.query.game_id;
  let name = req.query.name;
  let move = req.query.move;
  let game = games[gameId];

  if (!(0 <= gameId && gameId < games.length)) {
    res.send({ok: false, error: "Game does not exist."});
    return;
  }

  if (game.p1 !== name && game.p2 !== name) {
    res.send({ok: false, error: "You are not a player in this game."});
    return;
  }

  if (game.state !== "RUNNING") {
    res.send({ok: false, error: "Game is over."});
    return;
  }

  if (game.moves.includes(move)) {
    res.send({ok: false, error: "Move already made."});
    return;
  }

  if (game.p1 === name && game.moves.length % 2 == 0) {
    game.moves.push(move);
    res.send({ok: true});
  } else if (game.p2 === name && game.moves.length % 2 == 1) {
    game.moves.push(req.query.move);
    res.send({ok: true});
  } else {
    res.send({ok: false, error: "Player not in the game"});
  }
})

//Get Game details
app.get('/get_game/', (req, res) => {
  let gameId = req.query.game_id;
  let game = games[gameId];

  if (!(0 <= gameId && gameId < games.length)) {
    res.send({ok: false, error: "Game does not exist."});
    return;
  }
  res.send({ok: true, game: game});
});

//Get Game details
app.get('/list_game/', (req, res) => {

  games.map((game, index) => {
    return {
      id: index,
      p1: game.p1,
      p2: game.p2,
      state: game.state
    }
  });
  res.send({ok: true, games: games});
});


//Get a new game
app.get('/new_game/', async (req, res) => {
  if (req.query.name && req.query.name.length == 0) {
    res.send({ok: false, error: "Name is required."});
    return;
  }
  if (games.length === 0 || games[games.length - 1].state !== "WAITING_FOR_PLAYERS") {
    games.push({
      p1: req.query.name,
      p2: undefined,
      state: "WAITING_FOR_PLAYERS",
      moves: []
    });
  } else {
    let last_game = games[games.length - 1];
    last_game.p2 = req.query.name;
    last_game.state = "RUNNING";
  }

  res.send({ok: true, game_id: games.length - 1})
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});