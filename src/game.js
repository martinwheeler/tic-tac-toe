import { useEffect, useState } from "react";
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
import classNames from "classnames";

function Game() {
  const { width, height } = useWindowSize();
  const [possibleMoves, setMoves] = useState(POSSIBLE_MOVES);
  const [currentPlayer, setPlayer] = useState(PLAYER_ONE);
  const [winner, setWinner] = useState(WINNER.NONE);
  const [loading, setLoading] = useState(true);
  const hasWinner = winner !== WINNER.NONE;

  useEffect(() => {
    if (loading) {
      console.log("loading");
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [loading]);

  const handleCheckWinner = (currentMoves) => {
    let possiblePlay = "";

    // Check for a draw state
    possiblePlay = 0;
    currentMoves.forEach((row) => {
      row.forEach((square) => {
        if (!!square) {
          possiblePlay++;
        }
      });
    });

    // We know we have a draw state when all squares are consumed by a move
    if (possiblePlay === ROWS * COLUMNS) {
      setWinner(WINNER.DRAW);
      return;
    }

    // Check horizontal moves
    possiblePlay = "";
    for (let i = 0; i < ROWS; i++) {
      possiblePlay = "";
      for (let j = 0; j < COLUMNS; j++) {
        possiblePlay += currentMoves[i][j];
      }

      // https://stackoverflow.com/a/6619547
      if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length === COLUMNS) {
        setWinner(
          possiblePlay.includes(PLAYER_ONE)
            ? WINNER.PLAYER_ONE
            : WINNER.PLAYER_TWO
        );
        return;
      }
    }

    // Check vertical moves
    possiblePlay = "";
    for (let i = 0; i < ROWS; i++) {
      possiblePlay = "";
      for (let j = 0; j < COLUMNS; j++) {
        possiblePlay += currentMoves[j][i];
      }

      // https://stackoverflow.com/a/6619547
      if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length === COLUMNS) {
        setWinner(
          possiblePlay.includes(PLAYER_ONE)
            ? WINNER.PLAYER_ONE
            : WINNER.PLAYER_TWO
        );
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
    if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length === COLUMNS) {
      setWinner(
        possiblePlay.includes(PLAYER_ONE)
          ? WINNER.PLAYER_ONE
          : WINNER.PLAYER_TWO
      );
      return;
    }

    // Also sequential but flipped
    // 3,0:2,1:1,2:0,3 etc.
    possiblePlay = "";
    for (let i = 0; i < ROWS; i++) {
      possiblePlay += currentMoves[i][ROWS - 1 - i];
    }

    // https://stackoverflow.com/a/6619547
    if (/^(.)\1+$/.test(possiblePlay) && possiblePlay.length === COLUMNS) {
      setWinner(
        possiblePlay.includes(PLAYER_ONE)
          ? WINNER.PLAYER_ONE
          : WINNER.PLAYER_TWO
      );
      return;
    }
  };

  const handleAddMove = (row, square) => (e) => {
    const newMoves = possibleMoves.map((move) => move.slice());
    newMoves[row][square] = currentPlayer;

    setMoves(newMoves);
    handleCheckWinner(newMoves);
    setPlayer(currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
  };

  const handleResetGame = () => {
    setPlayer(PLAYER_ONE);
    setMoves(POSSIBLE_MOVES.map((move) => move.slice()));
    setWinner(WINNER.NONE);
  };

  const currentPlayerClass = classNames({
    "player-one": currentPlayer === PLAYER_ONE,
    "player-two": currentPlayer === PLAYER_TWO,
  });

  const currentWinnerClass = classNames({
    "player-one": winner === WINNER.PLAYER_ONE,
    "player-two": winner === WINNER.PLAYER_TWO,
  });

  return (
    <div className="game">
      {hasWinner && <Confetti width={width} height={height} />}
      {!hasWinner && (
        <div className="game-info">
          Player <span className={currentPlayerClass}>{currentPlayer}'s</span>{" "}
          turn
        </div>
      )}
      {hasWinner && (
        <div className="game-info">
          {winner === WINNER.DRAW ? (
            <>It was a draw!</>
          ) : (
            <>
              Player <span className={currentWinnerClass}>{winner}</span> is the
              winner
            </>
          )}
        </div>
      )}
      <Board
        hasWinner={winner !== WINNER.NONE}
        possibleMoves={possibleMoves}
        addMove={handleAddMove}
        currentPlayer={currentPlayer}
      />
      <button onClick={handleResetGame} className="game-button">
        New Game
      </button>
    </div>
  );
}

export default Game;
