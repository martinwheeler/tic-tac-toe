function Menu({ handleSetPlayStyle }) {
  return (
    <div className="menu">
      <button onClick={handleSetPlayStyle("single")} className="game-button">
        Singleplayer
      </button>
      <button onClick={handleSetPlayStyle("multi")} className="game-button">
        Multiplayer
      </button>
    </div>
  );
}

export default Menu;
