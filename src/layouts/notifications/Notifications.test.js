import React from "react";
import { render, screen } from "@testing-library/react";
import Notifications from "./index";
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
jest.mock("components/MDTypography", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="md-typography">{children}</div>,
}));
jest.mock("./NotificationBox", () => ({
  __esModule: true,
  default: () => <div data-testid="notification-box" />,
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

describe("Notifications Page", () => {
  // Test if all the parts of the page render correctly
  it("renders layout and notification components", () => {
    renderWithProviders(<Notifications />);

    expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-navbar")).toBeInTheDocument();

    expect(screen.getByText("Notifications")).toBeInTheDocument();

    expect(screen.getByTestId("notification-box")).toBeInTheDocument();
  });
});
