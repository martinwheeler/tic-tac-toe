import { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Board from "./components/board";
import Menu from "./components/menu";
import io from "socket.io-client";

import {
  ROWS,
  COLUMNS,
  PLAYER_ONE,
  PLAYER_TWO,
  WINNER,
  POSSIBLE_MOVES,
} from "./globals";
import classNames from "classnames";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? "wss://tic-tac-toe-martin.herokuapp.com/"
    : `ws://${window.location.hostname}:3001`;

function Game() {
  const { width, height } = useWindowSize();
  const [possibleMoves, setMoves] = useState(POSSIBLE_MOVES);
  const [currentPlayer, setPlayer] = useState(PLAYER_ONE);
  const [winner, setWinner] = useState(WINNER.NONE);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [showMenu, setShowMenu] = useState(true);
  const [playStyle, setPlayStyle] = useState(true);
  const hasWinner = winner !== WINNER.NONE;
  const isMultiplayer = playStyle === "multi";

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [loading]);

  useEffect(() => {
    if (isMultiplayer) {
      const newSocket = io(serverUrl);
      setSocket(newSocket);

      newSocket.on("moves", (newMoves) => {
        handleSetMoves(newMoves);
      });

      newSocket.on("player", (newPlayer) => {
        setPlayer(newPlayer);
      });

      newSocket.on("reset", resetGame);

      return () => newSocket.close();
    }
  }, [loading, playStyle]);

  const handleCheckWinner = (currentMoves) => {
    let possiblePlay = "";

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
  };

  const handleAddMove = (row, square) => (e) => {
    const newMoves = possibleMoves.map((move) => move.slice());
    newMoves[row][square] = currentPlayer;

    if (isMultiplayer) {
      socket.emit("moves", newMoves);
    }

    handleSetMoves(newMoves);
    handleSetPlayer();
  };

  const handleSetMoves = (newMoves) => {
    setMoves(newMoves);
    handleCheckWinner(newMoves);
  };

  const handleSetPlayer = () => {
    const newPlayer = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    if (isMultiplayer) {
      socket.emit("player", newPlayer);
    }

    setPlayer(newPlayer);
  };

  const resetGame = () => {
    setPlayer(PLAYER_ONE);
    setMoves(POSSIBLE_MOVES.map((move) => move.slice()));
    setWinner(WINNER.NONE);
  };

  const handleResetGame = () => {
    if (isMultiplayer) {
      socket.emit("reset");
    }
    resetGame();
  };

  const handleSetPlayStyle = (style) => () => {
    setShowMenu(false);
    setPlayStyle(style);
  };

  const handleMainMenu = () => {
    setPlayStyle(null);
    setShowMenu(true);
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
    <>
      {showMenu ? (
        <Menu handleSetPlayStyle={handleSetPlayStyle} />
      ) : (
        <div className="game">
          {hasWinner && <Confetti width={width} height={height} />}
          {!hasWinner && (
            <div className="game-info">
              Player{" "}
              <span className={currentPlayerClass}>{currentPlayer}'s</span> turn
            </div>
          )}
          {hasWinner && (
            <div className="game-info">
              {winner === WINNER.DRAW ? (
                <>It was a draw!</>
              ) : (
                <>
                  Player <span className={currentWinnerClass}>{winner}</span> is
                  the winner
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
          <button onClick={handleMainMenu} className="game-button">
            Main Menu
          </button>
        </div>
      )}
    </>
  );
}

export default Game;
