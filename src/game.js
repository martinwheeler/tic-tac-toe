import { useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Board from "./components/board";

import {
  ROWS,
  COLUMNS,
  PLAYER_ONE,
  PLAYER_TWO,
  WINNER,
  POSSIBLE_MOVES,
} from "./globals";

function Game() {
  const { width, height } = useWindowSize();
  const [possibleMoves, setMoves] = useState(POSSIBLE_MOVES);
  const [currentPlayer, setPlayer] = useState(PLAYER_ONE);
  const [winner, setWinner] = useState(WINNER.NONE);
  const hasWinner = winner !== WINNER.NONE;

  const handleCheckWinner = (currentMoves) => {
    let possiblePlay = "";

    // TODO: Check horizontal moves
    possiblePlay = "";
    for (let i = 0; i < ROWS; i++) {
      possiblePlay = "";
      for (let j = 0; j < COLUMNS; j++) {
        possiblePlay += currentMoves[i][j];
      }

      // https://stackoverflow.com/a/6619547
      if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length == COLUMNS) {
        setWinner(possiblePlay.includes(PLAYER_ONE) ? WINNER.ONE : WINNER.TWO);
        return;
      }
    }

    // TODO: Check vertical moves
    possiblePlay = "";
    for (let i = 0; i < ROWS; i++) {
      possiblePlay = "";
      for (let j = 0; j < COLUMNS; j++) {
        possiblePlay += currentMoves[j][i];
      }

      // https://stackoverflow.com/a/6619547
      if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length == COLUMNS) {
        setWinner(possiblePlay.includes(PLAYER_ONE) ? WINNER.ONE : WINNER.TWO);
        return;
      }
    }

    // First way is always sequential
    // 0,0:1,1:2,2:3,3 etc.
    possiblePlay = "";
    for (let i = 0; i < ROWS; i++) {
      possiblePlay += currentMoves[i][i];
    }

    // https://stackoverflow.com/a/6619547
    if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length == COLUMNS) {
      setWinner(possiblePlay.includes(PLAYER_ONE) ? WINNER.ONE : WINNER.TWO);
      return;
    }

    // Also sequential but flipped
    // 3,0:2,1:1,2:0,3 etc.
    possiblePlay = "";
    for (let i = 0; i < ROWS; i++) {
      possiblePlay += currentMoves[i][ROWS - 1 - i];
    }

    // https://stackoverflow.com/a/6619547
    if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length == COLUMNS) {
      setWinner(possiblePlay.includes(PLAYER_ONE) ? WINNER.ONE : WINNER.TWO);
      return;
    }
  };

  const handleAddMove = (row, square) => (e) => {
    const newMoves = possibleMoves.map((move) => move.slice());
    newMoves[row][square] = currentPlayer;

    handleCheckWinner(newMoves);
    setPlayer(currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
    setMoves(newMoves);
  };

  const handleResetGame = () => {
    setPlayer(PLAYER_ONE);
    setMoves(POSSIBLE_MOVES.map((move) => move.slice()));
    setWinner(WINNER.NONE);
  };

  return (
    <>
      {hasWinner && <Confetti width={width} height={height} />}
      {!hasWinner && (
        <div className="game-info">Player {currentPlayer}'s turn</div>
      )}
      {hasWinner && (
        <div className="game-info">Player {winner} is the winner</div>
      )}
      <Board
        hasWinner={winner != WINNER.NONE}
        possibleMoves={possibleMoves}
        addMove={handleAddMove}
        currentPlayer={currentPlayer}
      />
      <button onClick={handleResetGame} className="game-button">
        New Game
      </button>
    </>
  );
}

export default Game;
