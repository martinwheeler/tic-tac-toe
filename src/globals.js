const ROWS = 3;
const COLUMNS = 3;

const PLAYER_ONE = "X";
const PLAYER_TWO = "O";

const POSSIBLE_MOVES = Array(ROWS).fill(Array(COLUMNS).fill(""));

const WINNER = {
  NONE: "No one",
  PLAYER_ONE: PLAYER_ONE,
  PLAYER_TWO: PLAYER_TWO,
  DRAW: "Draw",
};

export { WINNER, POSSIBLE_MOVES, PLAYER_ONE, PLAYER_TWO, ROWS, COLUMNS };
