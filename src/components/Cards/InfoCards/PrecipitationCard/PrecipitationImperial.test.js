// Mocks
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({ imperialUnits: true }),
  UnitsProvider: ({ children }) => <>{children}</>,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import Precipitation from "./index";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

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

describe("Precipitation Component with imperial units", () => {
  // Test if everything renders correctly - with imperial units
  it("renders with title, icon, and volume using imperial units", () => {
    const data = {
      precipitationVol: 25.4, // 1 inch in mm
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

    // Volume label should be in inches (assuming your component converts)
    expect(screen.getByText("Overall Volume")).toBeInTheDocument();
    expect(screen.getByText("1 in")).toBeInTheDocument();
  });

  // Test if all the cards render correctly - with imperial units
  it("renders multiple PrecipitationCards with correct data in imperial", () => {
    const data = {
      precipitationVol: 88.9, // 3.5 inches in mm
      precipitationArray: [
        { pop: 0.9, vol: 63.5, time: "14:00", type: "rain" }, // 2.5 inches
        { pop: 0.5, vol: 25.4, time: "15:00", type: "rain" }, // 1 inch
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
    expect(screen.getByText("3.5 in")).toBeInTheDocument();

    // Time labels
    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText("15:00")).toBeInTheDocument();
  });
});
