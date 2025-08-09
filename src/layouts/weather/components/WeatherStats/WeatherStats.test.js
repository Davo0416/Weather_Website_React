import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import WeatherStats from "./index"; // adjust if needed

// Mocks
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({ imperialUnits: false }),
}));

jest.mock("context", () => ({
  useMaterialUIController: () => [{ sidenavColor: "info" }],
}));

// Mock subcomponents to prevent unrelated rendering complexity
jest.mock("components/Cards/InfoCards/ArrowCard", () => (props) => (
  <div data-testid={`ArrowCard-${props.title}`}>{props.title}: {props.value}</div>
));

jest.mock("components/Cards/InfoCards/AnimCard", () => (props) => (
  <div data-testid={`AnimCard-${props.title}`}>{props.title}: {props.value}</div>
));

jest.mock("components/Cards/InfoCards/Precipitation", () => (props) => (
  <div data-testid={`PrecipitationCard-${props.title}`}>{props.title}</div>
));

describe("WeatherStats", () => {
  const mockProps = {
    windSpeed: 12,
    windDir: 90,
    pressure: 1015,
    humidity: 60,
    coverage: 40,
    temperature: 22,
    visibility: 10000,
    precipitationData: { hourly: [0, 1, 2] },
    tempUnitLabel: "C",
    speedUnitLabel: "km/h",
    pressureUnitLabel: "hPa",
    visibilityUnitLabel: "km",
  };

  // Test if all the values are correctly displayed
  it("renders all cards with correct values", () => {
    render(<WeatherStats {...mockProps} />);

    expect(screen.getByTestId("ArrowCard-Temperature")).toHaveTextContent("22°C");
    expect(screen.getByTestId("ArrowCard-Wind")).toHaveTextContent("12 km/h");
    expect(screen.getByTestId("ArrowCard-Humidity")).toHaveTextContent("60%");
    expect(screen.getByTestId("ArrowCard-Clouds")).toHaveTextContent("40%");
    expect(screen.getByTestId("ArrowCard-Pressure")).toHaveTextContent("1015 hPa");
    expect(screen.getByTestId("AnimCard-Visibility")).toHaveTextContent("10 km");
    expect(screen.getByTestId("PrecipitationCard-Precipitation")).toBeInTheDocument();
  });
});
