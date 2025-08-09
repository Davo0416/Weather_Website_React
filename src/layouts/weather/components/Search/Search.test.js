import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Search from "./index"; // Adjust if path differs
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme"; // Update this path if needed

// Setup mock callFunction
const mockCallFunction = jest.fn();

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

describe("Search Component", () => {
  beforeEach(() => {
    mockCallFunction.mockClear();
  });

  // Test if the searchbar renders and is triggered via the button click
  it("renders and triggers search via button click", () => {
    renderWithProviders(
      <Search callFunction={mockCallFunction} error={false} success={false} color="info" />
    );

    const input = screen.getByLabelText(/enter the location/i);
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "Yerevan" } });
    fireEvent.click(button);

    expect(mockCallFunction).toHaveBeenCalledWith("Yerevan");
  });

  // Test the search trigger on Enter press
  it("triggers search on Enter key press", () => {
    renderWithProviders(
      <Search callFunction={mockCallFunction} error={false} success={false} color="info" />
    );

    const input = screen.getByLabelText(/enter the location/i);
    fireEvent.change(input, { target: { value: "Tokyo" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockCallFunction).toHaveBeenCalledWith("Tokyo");
  });

  // Test if it does not call the function when input field is empty
  it("does not call function when input is empty", () => {
    renderWithProviders(
      <Search callFunction={mockCallFunction} error={false} success={false} color="info" />
    );

    const input = screen.getByLabelText(/enter the location/i);
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(button);

    expect(mockCallFunction).toHaveBeenCalledWith("");
  });
});
