import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Weather from "./index";

// Mocks
jest.mock("components/MDBox", () => (props) => <div {...props} />);
jest.mock("components/MDTypography", () => (props) => <div {...props}>{props.children}</div>);
jest.mock("components/Charts/LineCharts/ReportsLineChart", () => (props) => (
  <div data-testid="chart">{props.title}</div>
));
jest.mock("layouts/weather/components/Time", () => (props) => (
  <div data-testid="time">{props.dayVal}</div>
));

describe("Weather Component", () => {
  const mockProps = {
    location: "Yerevan",
    day: "Today",
    countryCode: "AM",
    temperature: 30,
    unit: "C",
    timezone: 14400,
    weatherCondition: "Clear",
    tempData: { labels: [], datasets: [] },
    updated: Date.now(),
    color: "info",
  };

  // Tests if it renders the given information correctly
  it("renders weather information when props are provided", () => {
    render(<Weather {...mockProps} />);

    expect(screen.getByText(/Yerevan/)).toBeInTheDocument();
    expect(screen.getByText(/30°C/)).toBeInTheDocument();
    expect(screen.getByText(/Clear/)).toBeInTheDocument();
    expect(screen.getByTestId("time")).toHaveTextContent("Today");
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  // Tests if it is showing "Loading..." when loading the data
  it("renders loading state when data is missing", () => {
    render(<Weather {...mockProps} location="" />);
    expect(screen.getByText("Loading Weather ...")).toBeInTheDocument();
  });
});
