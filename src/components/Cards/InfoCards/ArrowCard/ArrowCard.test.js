import { render, screen } from "@testing-library/react";
import ArrowCard from "./index";
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

describe("ArrowCard Component", () => {
  // Test if everything is rendered correctly
  it("renders title, images, description, and value", () => {
    renderWithProviders(
      <ArrowCard
        color="success"
        image="cloud"
        arrow="arrow-icon"
        dir={90}
        title="Wind Direction"
        description="East Wind"
        value="15 km/h"
      />
    );

    // Title
    expect(screen.getByText("Wind Direction")).toBeInTheDocument();

    // Description
    expect(screen.getByText("East Wind")).toBeInTheDocument();

    // Value
    expect(screen.getByText("15 km/h")).toBeInTheDocument();

    // Main icon image
    const mainImg = screen.getByRole("img", { name: "Wind Direction" });
    expect(mainImg).toBeInTheDocument();
    expect(mainImg).toHaveAttribute("src", "/Weather_Icons/cloud.png");

    // Arrow image (not labeled, fallback to alt)
    const arrowImg = screen.getByAltText("arrow");
    expect(arrowImg).toBeInTheDocument();
    expect(arrowImg).toHaveAttribute("src", "/Weather_Icons/arrow-icon.png");

    // Direction should initially be applied via inline style
    expect(arrowImg).toHaveStyle("transform: rotate(90deg)");
  });

  // Test if it renders with the default values if any are not provided
  it("renders with default props when optional values are not provided", () => {
    renderWithProviders(
      <ArrowCard image="rainy" arrow="arrow" dir={45} title="Rain Arrow" />
    );

    // Title
    expect(screen.getByText("Rain Arrow")).toBeInTheDocument();

    // No description or value
    expect(screen.queryByText("East Wind")).not.toBeInTheDocument();
    expect(screen.queryByText("15 km/h")).not.toBeInTheDocument();

    // Main image
    const mainImg = screen.getByRole("img", { name: "Rain Arrow" });
    expect(mainImg).toBeInTheDocument();
    expect(mainImg).toHaveAttribute("src", "/Weather_Icons/rainy.png");

    // Arrow image
    const arrowImg = screen.getByAltText("arrow");
    expect(arrowImg).toBeInTheDocument();
    expect(arrowImg).toHaveAttribute("src", "/Weather_Icons/arrow.png");
  });
});
