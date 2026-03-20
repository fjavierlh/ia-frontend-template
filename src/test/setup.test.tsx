import { render, screen } from "@testing-library/react";
import App from "../App";

it("renders the main view", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /frontend template/i })).toBeInTheDocument();
});
