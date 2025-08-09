import { render, screen } from "@testing-library/react";
import Precipitation from "./index";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";
import { UnitsProvider } from "context/UnitsContext";

// Mocks
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv, PUBLIC_URL: "" };
});

afterEach(() => {
  process.env = originalEnv;
});

const renderWithProviders = (ui) => {
  const cache = createCache({ key: "css", prepend: true });
  return render(
    <CacheProvider value={cache}>
      <MaterialUIControllerProvider>
        <UnitsProvider>
          <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </UnitsProvider>
      </MaterialUIControllerProvider>
    </CacheProvider>
  );
};

describe("Precipitation Component", () => {
  
  // Test if everything renders correctly - with metric units
  it("renders with title, icon, and volume with metric units", () => {
    const data = {
      precipitationVol: 6.2,
      precipitationArray: [],
    };

    renderWithProviders(
      <Precipitation
        color="info"
        image="rain"
        title="Precipitation"
        precipitationData={data}
      />
    );

    // Title and image
    expect(screen.getByText("Precipitation")).toBeInTheDocument();
    const icon = screen.getByRole("img", { name: "Precipitation" });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "/Weather_Icons/rain.png");

    // Volume label
    expect(screen.getByText("Overall Volume")).toBeInTheDocument();
    expect(screen.getByText("6.2 mm")).toBeInTheDocument();
  });

  // Test if "No precipitation" is displayed when the precipitation array is empty
  it("renders fallback message if no precipitation array exists", () => {
    const data = {
      precipitationVol: 0,
      precipitationArray: [null],
    };

    renderWithProviders(
      <Precipitation
        color="info"
        image="rain"
        title="No Rain"
        precipitationData={data}
      />
    );

    expect(screen.getByText("No precipitation")).toBeInTheDocument();
  });

  // Test if the amount of the displayed cards and their data is correct
  it("renders two PrecipitationCards when data exists", () => {
    const data = {
      precipitationVol: 3.5,
      precipitationArray: [
        { pop: 0.9, vol: 2.5, time: "14:00", type: "rain" },
        { pop: 0.5, vol: 1.0, time: "15:00", type: "rain" },
      ],
    };

    renderWithProviders(
      <Precipitation
        color="info"
        image="rain"
        title="Rain Forecast"
        precipitationData={data}
      />
    );

    expect(screen.getByText("Rain Forecast")).toBeInTheDocument();
    expect(screen.getByText("Overall Volume")).toBeInTheDocument();
    expect(screen.getByText("3.5 mm")).toBeInTheDocument();

    // First and second time entries
    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText("15:00")).toBeInTheDocument();
  });
});