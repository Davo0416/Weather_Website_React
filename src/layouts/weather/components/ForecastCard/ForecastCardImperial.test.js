import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForecastCard from "./index";

// Mocks
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({ imperialUnits: true }),
}));

jest.mock("components/MDBox", () => (props) => {
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
});

jest.mock("components/MDTypography", () => (props) => {
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
});

describe("ForecastCard with imperial units", () => {
  const mockForecast = {
    day: "Monday",
    weather: "Clear",
    minTemp: 12,  // Assuming this is Celsius input, component should convert
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

  it("renders the forecast card with temperatures in °F", () => {
    render(<ForecastCard {...defaultProps} />);

    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();

    // Convert Celsius to Fahrenheit:
    // 12°C -> 53.6°F (rounded 54°F)
    // 26°C -> 78.8°F (rounded 79°F)
    expect(screen.getByText("54°F")).toBeInTheDocument();
    expect(screen.getByText("79°F")).toBeInTheDocument();
  });
});
