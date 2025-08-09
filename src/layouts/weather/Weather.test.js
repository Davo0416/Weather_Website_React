import React from "react";
import { render, screen } from "@testing-library/react";
import WeatherPage from "./index"; // Adjust if file name differs
import '@testing-library/jest-dom';

import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mock all subcomponents to isolate WeatherPage behavior
jest.mock("components/LayoutContainers/DashboardLayout", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}));
jest.mock("components/Navbars/DashboardNavbar", () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-navbar" />,
}));
jest.mock("components/MDBox", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="md-box">{children}</div>,
}));
jest.mock("layouts/weather/components/Search", () => ({
  __esModule: true,
  default: () => <div data-testid="search-component" />,
}));
jest.mock("layouts/weather/components/Weather", () => ({
  __esModule: true,
  default: () => <div data-testid="weather-component" />,
}));
jest.mock("layouts/weather/components/Forecast", () => ({
  __esModule: true,
  default: () => <div data-testid="forecast-component" />,
}));
jest.mock("layouts/weather/components/WeatherStats", () => ({
  __esModule: true,
  default: () => <div data-testid="weather-stats" />,
}));
jest.mock("components/Map", () => ({
  __esModule: true,
  default: () => <div data-testid="map-component" />,
}));
jest.mock("components/MapSettings", () => ({
  __esModule: true,
  default: () => <div data-testid="map-settings" />,
}));

// Mock context hooks
jest.mock("context/WeatherContext", () => ({
  useWeather: () => ({ weatherState: null, setWeatherState: jest.fn() }),
}));
jest.mock("context/AlertContext", () => ({
  useAlert: () => ({ addAlert: jest.fn() }),
}));
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({ imperialUnits: false }),
}));
jest.mock("context", () => ({
  useMaterialUIController: () => [{ darkMode: false, sidenavColor: "info" }, jest.fn()],
  MaterialUIControllerProvider: ({ children }) => <div>{children}</div>,
}));

// MUI Hooks
jest.mock("@mui/material", () => {
  const originalModule = jest.requireActual("@mui/material");
  return {
    ...originalModule,
    useTheme: () => ({
      breakpoints: {
        down: () => "max-width:1200px",
      },
    }),
    useMediaQuery: () => false, // Simulate desktop screen
  };
});

const renderWithProviders = (ui) => {
  const cache = createCache({ key: "css", prepend: true });
  return render(
    <CacheProvider value={cache}>
      <MaterialUIControllerProvider>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </MaterialUIControllerProvider>
    </CacheProvider>
  );
};

//Test if it renders all the components
describe("WeatherPage Component", () => {
  it("renders all main sections", () => {
    renderWithProviders(<WeatherPage />);

    expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-navbar")).toBeInTheDocument();
    expect(screen.getAllByTestId("md-box").length).toBeGreaterThan(0);
    expect(screen.getByTestId("search-component")).toBeInTheDocument();
    expect(screen.getByTestId("weather-component")).toBeInTheDocument();
    expect(screen.getByTestId("forecast-component")).toBeInTheDocument();
    expect(screen.getByTestId("map-component")).toBeInTheDocument();
    expect(screen.getByTestId("weather-stats")).toBeInTheDocument();
    expect(screen.getByTestId("map-settings")).toBeInTheDocument();
  });
});
