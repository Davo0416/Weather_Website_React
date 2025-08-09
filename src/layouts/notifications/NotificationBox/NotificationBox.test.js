import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationBox from "./index";
import "@testing-library/jest-dom";

import { waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
jest.mock("components/MDBox", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="md-box">{children}</div>,
}));
jest.mock("components/MDAlert", () => ({
  __esModule: true,
  default: ({ children, removeAlert, index }) => (
    <div data-testid={`md-alert-${index}`} onClick={() => removeAlert(index)}>
      {children}
    </div>
  ),
}));
jest.mock("components/MDTypography", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="md-typography">{children}</div>,
}));

const mockCloseAlert = jest.fn();
jest.mock("context/AlertContext", () => ({
  useAlert: () => ({
    alerts: [
      { id: 1, text: "Test Alert 1", color: "success" },
      { id: 2, text: "Test Alert 2", color: "error" },
    ],
    closeAlert: mockCloseAlert,
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

describe("NotificationBox Component", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  // Test the notification rendering when present
  it("renders alerts when alerts are present", () => {
    renderWithProviders(<NotificationBox />);

    expect(screen.getAllByTestId("md-box").length).toBeGreaterThan(0);
    expect(screen.getByTestId("md-alert-1")).toBeInTheDocument();
    expect(screen.getByTestId("md-alert-2")).toBeInTheDocument();
    expect(screen.getAllByTestId("md-typography")).toHaveLength(2);

    expect(screen.getByText("Test Alert 1")).toBeInTheDocument();
    expect(screen.getByText("Test Alert 2")).toBeInTheDocument();
  });

  // Test if closeAlert is called when notification is closed
  it("calls closeAlert when an alert is clicked", () => {
    renderWithProviders(<NotificationBox />);

    screen.getByTestId("md-alert-1").click();
    expect(mockCloseAlert).toHaveBeenCalledWith(1);

    screen.getByTestId("md-alert-2").click();
    expect(mockCloseAlert).toHaveBeenCalledWith(2);
  });

  // Test if it shows 'No Notifications' if there are no alerts
  it("renders 'No Notifications' if alert list is empty", async () => {
    // Override mock to simulate empty alert list
    jest.resetModules();
    jest.doMock("context/AlertContext", () => ({
      useAlert: () => ({
        alerts: [],
        closeAlert: jest.fn(),
      }),
    }));

    const EmptyNotificationBox = require("./index").default;

    renderWithProviders(<EmptyNotificationBox />);

    await waitFor(() => {
      expect(screen.getByText("No Notifications")).toBeInTheDocument();
    });
  });
});
