function Menu({ handleSetPlayStyle }) {
  return (
    <div className="menu">
      <span className="title">
        <span className="first">TIC</span>&nbsp;
        <span className="second">TAC</span>&nbsp;
        <span className="third">TOE</span>
      </span>

      <div className="game-buttons">
        <button onClick={handleSetPlayStyle("single")} className="button">
          Singleplayer
        </button>
        <button onClick={handleSetPlayStyle("multi")} className="button">
          Multiplayer
        </button>
      </div>
    </div>
  );
}

export default Menu;
