import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./index";
import "@testing-library/jest-dom";

import { waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
const weatherStateMock = {
  location: "London",
  temperature: 20,
  weather: "Clear",
  timezone: 0,
  countryCode: "GB",
  updated: 1620000000,
  forecastData: [
    {
      dayTimes: ["10:00", "13:00", "16:00"],
      dayTemps: [20, 21, 22],
    },
  ],
};

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
jest.mock("components/MDTypography", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="md-typography">{children}</div>,
}));
jest.mock("@mui/material/Card", () => (props) => (
  <div data-testid="mui-card">{props.children}</div>
));
jest.mock("@mui/material/Grid", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mui-grid">{children}</div>,
}));

jest.mock("layouts/plan/components/Planned", () => ({
  __esModule: true,
  default: ({ plannedRoutes }) => (
    <div data-testid="planned">{JSON.stringify(plannedRoutes)}</div>
  ),
}));

jest.mock("layouts/weather/components/Weather", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="weather">{JSON.stringify(props)}</div>
  ),
}));

jest.mock("layouts/notifications/NotificationBox", () => ({
  __esModule: true,
  default: () => <div data-testid="notification-box" />,
}));

jest.mock("context/WeatherContext", () => ({
  useWeather: () => ({
    weatherState: weatherStateMock,
  }),
}));

jest.mock("context/RoutesContext", () => ({
  useRoutes: () => ({
    routesState: {
      routes: [{ id: 1, route: "A-B" }],
    },
  }),
}));

jest.mock("context", () => ({
  useMaterialUIController: () => [{ sidenavColor: "info" }],
  MaterialUIControllerProvider: ({ children }) => <>{children}</>,
}));

jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({
    imperialUnits: true,
  }),
}));

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

describe("Dashboard Component", () => {
  // Test if everything is rendered correctly
  it("renders layout and child components with correct props", async () => {
    renderWithProviders(<Dashboard />);

    // Layout structure
    expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-navbar")).toBeInTheDocument();

    // Grid and Box
    expect(screen.getAllByTestId("mui-grid").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("md-box").length).toBeGreaterThan(0);

    // Typography
    expect(screen.getAllByTestId("md-typography").length).toBeGreaterThan(0);
    expect(screen.getByText("Notifications")).toBeInTheDocument();

    // Planned receives correct routes
    expect(screen.getByTestId("planned")).toHaveTextContent("A-B");

    // Notification box shows up
    expect(screen.getByTestId("notification-box")).toBeInTheDocument();

    // Weather props
    await waitFor(() => {
      const weatherProps = JSON.parse(screen.getByTestId("weather").textContent);
      expect(weatherProps.location).toBe("London");
      expect(weatherProps.unit).toBe("F"); // imperial
      expect(weatherProps.temperature).toBeCloseTo(68); // 20°C → 68°F
      //expect(Array.isArray(weatherProps.tempData.datasets.data)).toBe(true);
    });
  });
});
