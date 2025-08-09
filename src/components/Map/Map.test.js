import { render, screen } from "@testing-library/react";
import Map from "./index";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import { RoutesProvider } from "context/RoutesContext";
import { UserProvider } from "context/UserContext";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv, REACT_APP_API_URL: "https://api.example.com" };
  window.initMap = jest.fn();

  window.Clouds = jest.fn();
  window.Precipitation = jest.fn();
  window.Rain = jest.fn();
  window.Snow = jest.fn();
  window.Temperature = jest.fn();
  window.WindSpeed = jest.fn();
  window.Pressure = jest.fn();
  window.Contour = jest.fn();
  window.SelectMap = jest.fn();
  window.WindRose = jest.fn();
  window.Cities = jest.fn();
  window.foundLocation = jest.fn();
  window.DarkMode = jest.fn();
  window.Imperial = jest.fn();
  window.Route = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
  process.env = originalEnv;
});

const renderWithProviders = (ui) => {
  const cache = createCache({ key: "css", prepend: true });
  return render(
    <CacheProvider value={cache}>
      <MaterialUIControllerProvider>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <RoutesProvider>{ui}</RoutesProvider>
          </UserProvider>
        </ThemeProvider>
      </MaterialUIControllerProvider>
    </CacheProvider>
  );
};

describe("Map Component", () => {
  const mockCallCity = jest.fn();
  const mockSetLength = jest.fn();

  const defaultSettings = {
    clouds: true,
    precipitation: false,
    rain: false,
    snow: false,
    temperature: true,
    windSpeed: false,
    pressure: false,
    contour: false,
    selectedMap: "standard",
    cities: false,
    windRose: false,
    location: null,
    darkMode: false,
    imperialUnits: false,
    route: null,
  };

  // Test the map container and title rendering
  it("renders map container and title", () => {
    renderWithProviders(
      <Map
        settings={defaultSettings}
        callCity={mockCallCity}
        color="info"
        setLength={mockSetLength}
        doUpdate={false}
        doRoute={false}
      />
    );

    expect(screen.getByText("Map")).toBeInTheDocument();

    const mapDiv = document.getElementById("map");
    expect(mapDiv).toBeInTheDocument();
    expect(mapDiv).toHaveStyle({ height: "568px" });
  });

  // Test if initMap is called on load
  it("calls window.initMap on mount", () => {
    renderWithProviders(
      <Map
        settings={defaultSettings}
        callCity={mockCallCity}
        color="info"
      />
    );
    expect(window.initMap).toHaveBeenCalled();
  });

  // Test overlay function calls on settings change
  it("calls overlay functions when settings change", () => {
    const newSettings = { ...defaultSettings, location: { lat: 1, lon: 2 }, route: "route1", rain: true, cities: true };

    renderWithProviders(
      <Map
        settings={newSettings}
        callCity={mockCallCity}
        color="info"
      />
    );

    expect(window.Clouds).toHaveBeenCalledWith(defaultSettings.clouds);
    expect(window.Precipitation).toHaveBeenCalledWith(defaultSettings.precipitation);
    expect(window.Rain).toHaveBeenCalledWith(newSettings.rain);
    expect(window.Snow).toHaveBeenCalledWith(defaultSettings.snow);
    expect(window.Temperature).toHaveBeenCalledWith(defaultSettings.temperature);
    expect(window.WindSpeed).toHaveBeenCalledWith(defaultSettings.windSpeed);
    expect(window.Pressure).toHaveBeenCalledWith(defaultSettings.pressure);
    expect(window.Contour).toHaveBeenCalledWith(defaultSettings.contour);
    expect(window.SelectMap).toHaveBeenCalledWith(defaultSettings.selectedMap);
    expect(window.WindRose).toHaveBeenCalledWith(defaultSettings.windRose);
    expect(window.Cities).toHaveBeenCalledWith(newSettings.cities);
    expect(window.DarkMode).toHaveBeenCalledWith(defaultSettings.darkMode);
    expect(window.Imperial).toHaveBeenCalledWith(defaultSettings.imperialUnits);

    expect(window.foundLocation).toHaveBeenCalledWith(newSettings.location);
  });

  // Test the exposed CallCity function
  it("exposes window.CallCity function that calls prop callCity", () => {
    renderWithProviders(
      <Map settings={defaultSettings} callCity={mockCallCity} color="info" />
    );

    expect(typeof window.CallCity).toBe("function");
    window.CallCity("testCityId");
    expect(mockCallCity).toHaveBeenCalledWith("testCityId");
  });
});
