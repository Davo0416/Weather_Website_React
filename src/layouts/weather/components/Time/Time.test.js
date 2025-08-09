import React from "react";
import { render, screen, act } from "@testing-library/react";
import Time from "./index";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import '@testing-library/jest-dom';
import theme from "assets/theme";

// Helpers
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

describe("Time Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Tests if the time is displayed only if its for today
  it("displays 'dayVal' if it's not 'Today'", () => {
    renderWithProviders(<Time timezone={0} dayVal="Wednesday" />);
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
  });

  // Tests if the day and time are displayed if it is not for today
  it("displays weekday and time if 'dayVal' is 'Today'", () => {
    renderWithProviders(<Time timezone={0} dayVal="Today" />);

    act(() => {
      jest.advanceTimersByTime(1000); // allow interval to run
    });

    const output = screen.getByText(/^\w{3} \d{2}:\d{2}$/);
    expect(output).toBeInTheDocument();
  });

  // Tests if the time updates correctly every second
  it("updates time every second", () => {
    renderWithProviders(<Time timezone={0} dayVal="Today" />);
    const initialText = screen.getByText(/^\w{3} \d{2}:\d{2}$/).textContent;

    // Advance time by 60 seconds
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    const updatedText = screen.getByText(/^\w{3} \d{2}:\d{2}$/).textContent;
    expect(updatedText).not.toEqual(initialText);
  });
});
