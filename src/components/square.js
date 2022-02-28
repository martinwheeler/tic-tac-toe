import classNames from "classnames";
import { PLAYER_ONE, PLAYER_TWO, ROWS } from "../globals";

const locked = {
  pointerEvents: "none",
};

function Square({ currentMove, currentPlayer, row, column, ...props }) {
  const styles = {
    ...((currentMove && locked) || {}),
  };

  const classes = classNames("square", {
    "square-left": column === 0,
    "square-bottom": row === ROWS - 1,
    "player-one": currentMove === PLAYER_ONE,
    "player-two": currentMove === PLAYER_TWO,
  });

  return (
    <div {...props} style={styles} className={classes}>
      {currentMove}
    </div>
  );
}

export default Square;
