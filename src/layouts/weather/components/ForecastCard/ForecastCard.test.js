import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import ForecastCard from "./index";

// Mock useUnits from context
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({ imperialUnits: false }),
}));

// Mock image loading
jest.mock("components/MDBox", () => (props) => {
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
});

jest.mock("components/MDTypography", () => (props) => {
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
});

describe("ForecastCard", () => {
  const mockForecast = {
    day: "Monday",
    weather: "Clear",
    minTemp: 12,
    maxTemp: 26,
  };

  const mockCallFunction = jest.fn();

  const defaultProps = {
    forecast: mockForecast,
    callFunction: mockCallFunction,
    num: 1,
    selectedNum: 1,
    color: "info",
  };

  // Test if the correct data is rendered
  it("renders the forecast card with correct data", () => {
    render(<ForecastCard {...defaultProps} />);

    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("12°C")).toBeInTheDocument();
    expect(screen.getByText("26°C")).toBeInTheDocument();
  });

  // Test the function call with the correct id on click
  it("calls the function with the correct id when clicked", () => {
    render(<ForecastCard {...defaultProps} />);
    const clickableBox = screen.getByText("Monday").closest("div");
    fireEvent.click(clickableBox);
    expect(mockCallFunction).toHaveBeenCalledWith(1);
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
});
