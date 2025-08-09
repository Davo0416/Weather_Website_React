import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Planned from "./index";
import '@testing-library/jest-dom';
import { within } from "@testing-library/react";

import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
jest.mock("components/MDBox", () => ({ children }) => <div data-testid="md-box">{children}</div>);
jest.mock("components/MDTypography", () => (props) => <div {...props} data-testid="typography" />);
jest.mock("components/MDButton", () => (props) => (
  <button {...props} data-testid="md-button">{props.children}</button>
));
jest.mock("components/MDInput", () => (props) => (
  <input {...props} data-testid={`md-input-${props.name || props.label}`} />
));
jest.mock("layouts/plan/components/Route", () => (props) => (
  <div data-testid="route" {...props} />
));
jest.mock("context/UserContext", () => ({
  useUser: () => ({ user: null }),
}));
jest.mock("context", () => ({
  useMaterialUIController: () => [{ darkMode: false }],
  MaterialUIControllerProvider: ({ children }) => <div>{children}</div>,
}));

const renderWithProviders = (ui) => {
  const cache = createCache({ key: "css", prepend: true });

  return render(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </CacheProvider>
  );
};

describe("Planned Component", () => {
  const mockProps = {
    plannedRoutes: [
      { route: "A-B", date: "2025-01-01 10:00", distance: "5", time: "2 hours", weather: "Clear" },
    ],
    noEdit: false,
    addRoute: jest.fn(),
    deleteRoute: jest.fn(),
    editIndex: null,
    startEditRoute: jest.fn(),
    selectRouteMap: jest.fn(),
    selectedId: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test if the routes are rendered correctly
  it("renders route list when plannedRoutes is not empty", () => {
    renderWithProviders(<Planned {...mockProps} />);
    expect(screen.getByTestId("route")).toBeInTheDocument();
  });

  // Test if the 'No planned routes' is displayed when there are no routes
  it("renders 'No planned routes' when plannedRoutes is empty", () => {
    renderWithProviders(<Planned {...mockProps} plannedRoutes={[]} />);
    expect(screen.getByText("No planned routes")).toBeInTheDocument();
  });

  // Test if the add button is displayed when adding a new route
  it("renders add button when noEdit is false", () => {
    renderWithProviders(<Planned {...mockProps} />);
    expect(screen.getByTestId("md-button")).toBeInTheDocument();
  });

  // Test if the dialog opens on 'add new route' click
  it("opens the dialog when 'add new route' is clicked", () => {
    renderWithProviders(<Planned {...mockProps} />);
    fireEvent.click(screen.getByTestId("md-button")); // Click the 'Add New Route' button
    expect(screen.getByText("Add a new route")).toBeInTheDocument();
  });

  // Test if the sign in suggestion is displayed when the user is not logged in
  it("renders sign-in prompt when user is not logged in", () => {
    renderWithProviders(<Planned {...mockProps} />);
    expect(screen.getByText("Sign in to save your planned routes")).toBeInTheDocument();
  });

  // Test if the route is vallidated and correctly added when the user clicks the add button
  it("submits a valid route and calls addRoute", () => {
    renderWithProviders(<Planned {...mockProps} />);

    fireEvent.click(screen.getByTestId("md-button")); // Open dialog

    fireEvent.change(screen.getByTestId("md-input-Location 1"), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByTestId("md-input-Location 2"), {
      target: { value: "B" },
    });
    fireEvent.change(screen.getByTestId("md-input-startDate"), {
      target: { value: "2025-01-01" },
    });
    fireEvent.change(screen.getByTestId("md-input-startTime"), {
      target: { value: "10:00" },
    });

    const dialog = screen.getByRole("dialog");

    fireEvent.click(within(dialog).getAllByRole("button", { name: /add/i })[1]);

    expect(mockProps.addRoute).toHaveBeenCalledWith(
      expect.objectContaining({
        route: "A-B",
        date: "2025-01-01 10:00",
      })
    );
  });
});
