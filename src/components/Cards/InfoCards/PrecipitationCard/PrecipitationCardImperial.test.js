// Mocks
jest.mock("context/UnitsContext", () => ({
  useUnits: () => ({ imperialUnits: true }),
  UnitsProvider: ({ children }) => <>{children}</>,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import PrecipitationCard from "./index";
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

describe("PrecipitationCard Component with imperial units", () => {
  // Test if its using imperial units when they are enabled
  it("renders correctly with imperial units", () => {
    renderWithProviders(
      <PrecipitationCard
        color="info"
        type="Snow"
        pop={10}
        volume={25.4} // 1 inch
        time="10:00 AM"
      />
    );

    expect(screen.getByText("Heavy Snow")).toBeInTheDocument();
    expect(screen.getByText("1 in/h")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("10% Chance")).toBeInTheDocument();
  });
});
