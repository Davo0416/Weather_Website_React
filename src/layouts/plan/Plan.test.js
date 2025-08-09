import React from "react";
import { render, screen } from "@testing-library/react";
import Plan from "./index"; // Adjust if filename is different
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
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
jest.mock("components/Map", () => ({
  __esModule: true,
  default: () => <div data-testid="map-component" />,
}));
jest.mock("layouts/plan/components/Planned", () => ({
  __esModule: true,
  default: () => <div data-testid="planned-component" />,
}));

jest.mock("context/RoutesContext", () => ({
  useRoutes: () => ({
    routesState: {
      routes: [],
      currentRoute: null,
    },
    setRoutesState: jest.fn(),
  }),
}));
jest.mock("context/AlertContext", () => ({
  useAlert: () => ({
    addAlert: jest.fn(),
  }),
}));
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({
    imperialUnits: false,
  }),
}));
jest.mock("context", () => ({
  useMaterialUIController: () => [{ sidenavColor: "info" }, jest.fn()],
  MaterialUIControllerProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock("@mui/material", () => {
  const originalModule = jest.requireActual("@mui/material");
  return {
    ...originalModule,
    useTheme: () => ({
      breakpoints: {
        down: () => "max-width:1200px",
      },
    }),
    useMediaQuery: () => false,
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
describe("Plan Page Component", () => {
  it("renders main layout structure and child components", () => {
    renderWithProviders(<Plan />);

    expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-navbar")).toBeInTheDocument();
    expect(screen.getAllByTestId("md-box").length).toBeGreaterThan(0);
    expect(screen.getByTestId("planned-component")).toBeInTheDocument();
    expect(screen.getByTestId("map-component")).toBeInTheDocument();
  });
});
