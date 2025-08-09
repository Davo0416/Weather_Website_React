import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Forecast from "./index";
import ForecastCard from "layouts/weather/components/ForecastCard";

import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";
import '@testing-library/jest-dom';

// Mocks
jest.mock("layouts/weather/components/ForecastCard", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="forecast-card" />),
}));

const mockCallFunction = jest.fn();

const renderWithProviders = (ui) => {
  const cache = createCache({ key: "css", prepend: true });

  const renderResult  = render(
    <CacheProvider value={cache}>
      <MaterialUIControllerProvider>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </MaterialUIControllerProvider>
    </CacheProvider>
  );
  return renderResult;
};

describe("Forecast Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockForecastData = [
    { day: "Mon", weather: "Clear", minTemp: 10, maxTemp: 20 },
    { day: "Tue", weather: "Rain", minTemp: 12, maxTemp: 22 },
    { day: "Wed", weather: "Clouds", minTemp: 11, maxTemp: 21 },
    { day: "Thu", weather: "Clear", minTemp: 13, maxTemp: 23 },
    { day: "Fri", weather: "Rain", minTemp: 14, maxTemp: 24 },
  ];

  const defaultProps = {
    forecastData: mockForecastData,
    updated: "2 hours",
    callFunction: mockCallFunction,
    selectedNum: 2,
    color: "info",
  };

  // Test if it displays "Loading..." while the data is loading
  it("renders loading state when forecastData is empty", () => {
    renderWithProviders(<Forecast {...defaultProps} forecastData={[]} />);
    expect(screen.getByText("Forecast")).toBeInTheDocument();
    expect(screen.getByText("Loading Forecast ...")).toBeInTheDocument();
  });

  // Test if the ForecastCards are rendered when the data is loaded
  it("renders ForecastCards when forecastData is provided", () => {
    renderWithProviders(<Forecast {...defaultProps} />);
    expect(screen.getByText("Forecast")).toBeInTheDocument();
    expect(screen.getByText(/updated 2 hours ago/i)).toBeInTheDocument();
  });

  // Test if the correct data is passed to the ForecastCards
  it("passes correct props to ForecastCard", () => {
    renderWithProviders(<Forecast {...defaultProps} />);

    expect(ForecastCard).toHaveBeenCalledTimes(5);
    expect(ForecastCard).toHaveBeenCalledWith(
      expect.objectContaining({
        color: defaultProps.color,
        forecast: expect.any(Object),
        callFunction: defaultProps.callFunction,
        selectedNum: defaultProps.selectedNum,
        num: expect.any(Number),
      }),
      expect.anything()
    );
  });
});
