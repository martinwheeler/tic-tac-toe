import classNames from "classnames";
import { ROWS } from "../globals";

const locked = {
  pointerEvents: "none",
};

function Square({ currentMove, row, column, ...props }) {
  const styles = {
    ...((currentMove && locked) || {}),
  };

  const classes = classNames("square", {
    "square-left": column == 0,
    "square-bottom": row == ROWS - 1,
  });

  return (
    <div {...props} style={styles} className={classes}>
      {currentMove}
    </div>
  );
}

export default Square;
