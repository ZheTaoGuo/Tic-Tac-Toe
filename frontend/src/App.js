//client/src/App.js
import React, { useState, useEffect } from "react";
import "./index.css"
import { io } from "socket.io-client";
import axios from "axios";
const socket = io("http://localhost:5000");


const App = () => {
  const [game, setGame] = useState({
    board: Array(9).fill(null),
    currentPlayer: "X",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState("Player X");
  const [announcement, setAnnouncement] = useState("");
  const [declareWinner, setDeclareWinner] = useState(false);

  useEffect(() => {
    socket.on("moveMade", (data) => {
      console.log("this is data", data)
      setGame(data.updatedGame);
      setPlayerTurn(data.updatedGame.currentPlayer);
      setErrorMessage("");
      console.log("this is game", data.updatedGame)

      console.log("game state", data.updatedGame.board.every(square => square !== null))
      if (data.updatedGame.board.every(square => square !== null)) {
        setErrorMessage("Game has ended. All squares are filled.");
        return;
      }

    });

    socket.on("gameReset", (newGame) => {
      setGame(newGame);
      setPlayerTurn("Player X");
      setErrorMessage("");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("moveMade");
      socket.off("gameReset");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        console.log("winner:", squares[a]);
        return squares[a];
      }
    }
  };

  const makeMove = (index) => {
    //TO-DO: make the post call to the express server here 
    if (calculateWinner(game.board)) {
      setErrorMessage("Invalid move. Please try again.");
      return;
    }

    const squares = [...game.board];

    squares[index] = game.currentPlayer;

    const updatedGame = {
      ...game,
      board: squares,
      currentPlayer: game.currentPlayer === "X" ? "O" : "X",
    };

    socket.emit("makeMove", { index, updatedGame });
  };

  const resetGame = () => {
    axios.get('http://localhost:5000/new_game',{
        params: {
          p1: "X",
          p2: "O"
        }
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      })
    const newGame = {
      board: Array(9).fill(null),
      currentPlayer: "X",
    };
    setAnnouncement("");

    socket.emit("resetGame", newGame);
  };

  const winner = calculateWinner(game.board);


  const announceBoardStatus = (board) => {
    let announcement = ""
    if (board.filter((cell) => cell === null).length === 9) {
        announcement = "No flags added yet"      
    } else {
      let flags = ["X", "O"];
      flags.forEach(flag => {
        const positions = board.reduce((acc, cell, index) => {
          if (cell === flag) acc.push(index + 1);
          return acc;
        }, []);
        if (flag !== null && positions.length > 0) {
          announcement += `Flag ${flag} is placed at position: ${positions.join(", ")}.\n`;
        }
      });
      }
    setAnnouncement(announcement);
  }
  return (
    <div className="app-container">
      <div className="game-container">
      <div className="title">
        <h1>Tic Tac Toe Game</h1>
      </div>
      <div className="board-border">
        <div className="board">
          {game.board.map((cell, index) => (
            <div
            key={index}
            className={`cell ${winner && winner === cell ? "winner" : ""}`}
            onClick={() => makeMove(index)}
          > {cell} </div>
          ))}
        </div>
        <p className="current-player">
          {errorMessage && (
          <p className="error-message">{errorMessage}</p>)}
        </p>
        <p className="current-player"> {winner ? `Player ${winner} wins!` : `Current Player: ${playerTurn}`}</p>
        <p id="announce" aria-live="assertive">{announcement}<br/></p>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>

        <button className="announce-button" onClick={() => announceBoardStatus(game.board)}>Announce Board</button>
      </div>
      </div>

    </div>
  );
};

export default App;
