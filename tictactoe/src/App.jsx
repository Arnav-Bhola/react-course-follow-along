import React, { useState } from "react";

import Player from "./components/player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const deriveGameBoard = (gameTurns) => {
  let gameBoard = [...initialGameBoard.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
};

const deriveWinner = (gameBoard, players) => {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
};

function App() {
  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player 2",
  });
  const [gameTurns, setGameTurns] = useState([]);
  const [activePlayer, setActivePlayer] = useState("X");
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);

  const handleSelectSquare = (rowIndex, colIndex) => {
    setActivePlayer((currentActivePlayer) => (currentActivePlayer === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      const updatedTurns = [
        {
          square: { row: rowIndex, col: colIndex },
          player: prevTurns.length > 0 && prevTurns[0].player === "X" ? "O" : "X",
        },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  };

  const handleRestart = () => {
    setGameTurns([]);
  };

  const handlePlayerNameChange = (symbol, newName) => {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  };

  return (
    <main>
      <div id='game-container'>
        <ol
          id='players'
          className='highlight-player'
        >
          <Player
            initialName='Player 1'
            symbol='X'
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName='Player 2'
            symbol='O'
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || (gameTurns.length === 9 && !winner)) && (
          <GameOver
            winner={winner}
            onRestart={handleRestart}
          />
        )}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;

