import Square from "./square";

const locked = {
  pointerEvents: "none",
};

function Board(props) {
  const renderSquare = (rowIndex) => (move, squareIndex) => {
    return (
      <Square
        onClick={props.addMove(rowIndex, squareIndex)}
        currentMove={move}
        currentPlayer={props.currentPlayer}
        row={rowIndex}
        column={squareIndex}
        key={`${rowIndex}-${squareIndex}`}
      />
    );
  };

  const renderRows = (squares, rowIndex) => {
    return (
      <div key={rowIndex} className="row">
        {squares.map(renderSquare(rowIndex))}
      </div>
    );
  };

  const styles = {
    ...(props.hasWinner ? locked : {}),
  };

  return (
    <div className="board" style={styles}>
      {props.possibleMoves.map(renderRows)}
    </div>
  );
}

export default Board;
