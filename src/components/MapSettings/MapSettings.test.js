import { render, screen, fireEvent } from "@testing-library/react";
import MapSettings from "./index";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv, PUBLIC_URL: "" };
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
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

describe("MapSettings Component", () => {
  const mockCallFunction = jest.fn();

  beforeEach(() => {
    mockCallFunction.mockClear();
  });

  // Test if the Titles rendering is correct
  it("renders the component with all main titles", () => {
    renderWithProviders(<MapSettings callFunction={mockCallFunction} color="info" />);

    expect(screen.getByText("Map Settings")).toBeInTheDocument();
    expect(screen.getByText("Maps")).toBeInTheDocument();
    expect(screen.getByText("Layers")).toBeInTheDocument();
    expect(screen.getByText("Current Weather")).toBeInTheDocument();
  });

  // Test the map type radios initial state
  it("initially sets 'standard' map radio checked and switches off", () => {
    renderWithProviders(<MapSettings callFunction={mockCallFunction} color="info" />);

    const standardRadio = screen.getAllByRole("radio")[0];
    const humanitarianRadio = screen.getAllByRole("radio")[1];
    expect(standardRadio).toBeChecked();
    expect(humanitarianRadio).not.toBeChecked();
  });

  // Test the map type radio change callback
  it("changes selected map radio and calls callback with updated settings", () => {
    renderWithProviders(<MapSettings callFunction={mockCallFunction} color="info" />);

    const humanitarianRadio = screen.getAllByRole("radio")[1];

    fireEvent.click(humanitarianRadio);

    expect(humanitarianRadio).toBeChecked();

    // Last call to callFunction should have selectedMap = humanitarian
    const lastCallArg = mockCallFunction.mock.calls[mockCallFunction.mock.calls.length - 1][0];
    expect(lastCallArg.selectedMap).toBe("humanitarian");

    const allCheckboxes = screen.getAllByRole("checkbox");
    allCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  // Test toggling some switches and the callback
  it("toggles switches and calls callback with updated state", () => {
    renderWithProviders(<MapSettings callFunction={mockCallFunction} color="info" />);

    const cloudsSwitch = screen.getAllByRole("checkbox")[0];
    const rainSwitch = screen.getAllByRole("checkbox")[2];

    fireEvent.click(cloudsSwitch);
    expect(cloudsSwitch).toBeChecked();

    fireEvent.click(rainSwitch);
    expect(rainSwitch).toBeChecked();

    // Get the last call argument
    const lastCallArg = mockCallFunction.mock.calls[mockCallFunction.mock.calls.length - 1][0];
    expect(lastCallArg.clouds).toBe(true);
    expect(lastCallArg.rain).toBe(true);
  });
});
