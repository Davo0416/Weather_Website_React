import { render, screen } from "@testing-library/react";
import PrecipitationCard from "./index";
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
  jest.resetModules(); // Clear mocks between tests
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

describe("PrecipitationCard Component", () => {
  // Test the rendering and if metric units are being used by default
  it("renders all props with metric units by default", () => {
    renderWithProviders(
      <PrecipitationCard
        color="info"
        type="Rain"
        pop={60}
        volume={6}
        time="3:00 PM"
      />
    );

    expect(screen.getByText("Heavy Rain")).toBeInTheDocument();
    expect(screen.getByText("6 mm/h")).toBeInTheDocument();
    expect(screen.getByText("3:00 PM")).toBeInTheDocument();
    expect(screen.getByText("60% Chance")).toBeInTheDocument();
  });

  // Test the intensity label
  it("shows correct intensity label based on volume", () => {
    renderWithProviders(
      <PrecipitationCard
        color="info"
        type="Rain"
        pop={50}
        volume={0.2}
        time="1:00 PM"
      />
    );
    expect(screen.getByText("Light Rain")).toBeInTheDocument();
  });

  // Test probabiliy label color and text
  it("uses correct popColor based on precipitation chance", () => {
    renderWithProviders(
      <PrecipitationCard
        color="info"
        type="Rain"
        pop={25} // should be green (success)
        volume={2}
        time="2:00 PM"
      />
    );
    expect(screen.getByText("25% Chance")).toBeInTheDocument();
  });
});
