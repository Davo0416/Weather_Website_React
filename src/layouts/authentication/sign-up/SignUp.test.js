import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cover from "./index"; // adjust path as needed
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import { MaterialUIControllerProvider } from "context";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "assets/theme";
import { MemoryRouter } from "react-router-dom";

// Mocks

const renderWithProviders = (ui) => {
  const cache = createCache({ key: "css", prepend: true });
  return render(
    <CacheProvider value={cache}>
      <MemoryRouter>
        <MaterialUIControllerProvider>
          <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </MaterialUIControllerProvider>
      </MemoryRouter>
    </CacheProvider>
  );
};

describe("Cover Component (Signup)", () => {
  beforeEach(() => {
    // Clear any mocks before each test
    jest.resetAllMocks();
  });

  // Test if rendered correctly and the submission works
  it("renders signup form and submits successfully", async () => {
    // Mock fetch to simulate a successful signup API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );

    renderWithProviders(<Cover />);

    // Check that form fields are rendered
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Fill out form fields
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit form
    fireEvent.click(submitButton);

    // Submit button should be disabled and show loading text
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/signing up/i);

    // Wait for success message to appear
    await waitFor(() =>
      expect(screen.getByText(/signup successful! you can now log in/i)).toBeInTheDocument()
    );

    // Inputs should be cleared after success
    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");

    // Submit button enabled again with original text
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent(/sign up/i);
  });

  // Test error message when signup failed
  it("shows error message on failed signup", async () => {
    // Mock fetch to simulate failure response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: "Email already exists" }),
      })
    );

    renderWithProviders(<Cover />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Wait for error message
    await waitFor(() =>
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    );

    // Submit button enabled again
    expect(screen.getByRole("button", { name: /sign up/i })).toBeEnabled();
  });

  // Test server error message when encountered a server issue
  it("shows server error message on fetch failure", async () => {
    // Mock fetch to simulate a network error
    global.fetch = jest.fn(() => Promise.reject(new Error("Network Error")));

    renderWithProviders(<Cover />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByText(/server error. please try again later./i)).toBeInTheDocument()
    );

    expect(screen.getByRole("button", { name: /sign up/i })).toBeEnabled();
  });
});
