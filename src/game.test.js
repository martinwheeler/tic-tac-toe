import { render, screen } from "@testing-library/react";
import Game from "./game";

test("renders text stating who's turn it is", () => {
  render(<Game />);
  const whosTurnElement = screen.getByText(/player .'s turn/i);
  expect(whosTurnElement).toBeInTheDocument();
});
