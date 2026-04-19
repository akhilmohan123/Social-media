// src/components/Test.test.jsx
import { render, screen } from "@testing-library/react";
import Test from "./Test";
import { test, expect } from "vitest";
test("renders text", () => {
  render(<Test />);
  expect(screen.getByText("Hello Akhil")).toBeInTheDocument();
});