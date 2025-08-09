import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Basic from "./index";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";

// Mocks
jest.mock("layouts/authentication/components/BasicLayout", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="basic-layout">{children}</div>,
}));

jest.mock("@mui/material/Card", () => (props) => (
  <div data-testid="mui-card">{props.children}</div>
));

jest.mock("components/MDBox", () => ({
  __esModule: true,
  default: ({ children, ...props }) => <div {...props}>{children}</div>,
}));
jest.mock("components/MDTypography", () => ({
  __esModule: true,
  default: ({ children, ...props }) => <div {...props}>{children}</div>,
}));
jest.mock("components/MDInput", () => ({
  __esModule: true,
  default: ({ value, onChange, label, type }) => (
    <input
      aria-label={label}
      type={type}
      value={value}
      onChange={onChange}
      data-testid={`mdinput-${label.toLowerCase()}`}
    />
  ),
}));
jest.mock("components/MDButton", () => ({
  __esModule: true,
  default: ({ children, type, onClick, disabled }) => (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

const mockSetUser = jest.fn();
jest.mock("context/UserContext", () => ({
  useUser: () => ({
    setUser: mockSetUser,
  }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
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

describe("Sign In Page (Basic)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete global.fetch; // Reset fetch mock
  });

  // Test if the form renders correctly
  it("renders sign in form inputs and button", () => {
    renderWithProviders(<Basic />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  // Test the inputs
  it("allows user to input email and password", () => {
    renderWithProviders(<Basic />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  // Test the remember me switch
  it("toggles remember me switch", () => {
    renderWithProviders(<Basic />);

    const switchCheckbox = screen.getByRole("checkbox");
    expect(switchCheckbox).toBeInTheDocument();
    expect(switchCheckbox.checked).toBe(false);

    fireEvent.click(switchCheckbox);
    expect(switchCheckbox.checked).toBe(true);

    fireEvent.click(switchCheckbox);
    expect(switchCheckbox.checked).toBe(false);
  });
});
