import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Route from "./index";
import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";
import { within } from "@testing-library/react";

import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({ imperialUnits: false }),
}));
jest.mock("context", () => ({
  useMaterialUIController: () => [{ darkMode: false }],
  MaterialUIControllerProvider: ({ children }) => <div>{children}</div>,
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

describe("Route Component", () => {
  const mockRouteInfo = {
    route: "A-B",
    date: "2025-01-01 10:00",
    distance: 10,
    time: "2 hours",
    weather: "Clear",
  };

  const defaultProps = {
    routeInfo: mockRouteInfo,
    index: 0,
    selectedId: null,
    selectRoute: jest.fn(),
    deleteRoute: jest.fn(),
    onEdit: jest.fn(),
    noEdit: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test if route info is correctly displayed
  it("renders route info correctly", () => {
    renderWithProviders(<Route {...defaultProps} />);
    expect(screen.getByText("A-B")).toBeInTheDocument();
    expect(screen.getByText("2025-01-01 10:00")).toBeInTheDocument();
    expect(screen.getByText(/Distance:/)).toHaveTextContent("10 Kilometers");
    expect(screen.getByText(/Journey Time:/)).toHaveTextContent("2 hours");
    expect(screen.getByText(/Weather:/)).toHaveTextContent("Clear");
  });

  // Test if route is selected when clicked
  it("calls selectRoute when route card is clicked", () => {
    renderWithProviders(<Route {...defaultProps} />);
    fireEvent.click(screen.getByText("A-B"));
    expect(defaultProps.selectRoute).toHaveBeenCalledWith(0);
  });

  // Test if delete confirmation dialogue opens and closes correctly
  it("opens and closes delete confirmation dialog", async () => {
    renderWithProviders(<Route {...defaultProps} />);
    fireEvent.click(screen.getAllByText(/delete/i)[0]); // Open dialog
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this route/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/cancel/i)); // Close dialog
    
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  // Test if onEdit is called when edit button is clicked
  it("calls onEdit when edit button is clicked", () => {
    renderWithProviders(<Route {...defaultProps} />);
    fireEvent.click(screen.getAllByText(/edit/i)[0]);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(0);
  });

  // Test if the edit and delete buttons are hidden when noEdit is true
  it("does not render edit/delete buttons when noEdit is true", () => {
    renderWithProviders(<Route {...defaultProps} noEdit={true} />);
    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
  });

  // Test if the data is displayed in imperial units when needed
  it("calls deleteRoute on confirm", async () => {
    const deleteMock = jest.fn();

    renderWithProviders(
      <Route
        {...defaultProps}
        deleteRoute={deleteMock}
      />
    );

    fireEvent.click(screen.getAllByText(/delete/i)[0]); // Open dialog

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getAllByText(/delete/i)[1]); // Confirm delete

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(mockRouteInfo);
    });
  });
});
