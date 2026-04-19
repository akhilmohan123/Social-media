import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Mdblogin from "./Mdblogin";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { expect,describe,test } from "vitest";
// 🔥 MOCKS

// mock API
vi.mock("../../Socialmedia/axios/Axios", () => ({
  _post: vi.fn(),
}));

// mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// mock router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// mock redux dispatch
const mockStore = createStore(() => ({}));


// 🔥 TESTS

describe("Mdblogin Component", () => {

  test("renders login form", () => {
    render(
      <Provider store={mockStore}>
        <Mdblogin />
      </Provider>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });


  test("user can type email and password", () => {
    render(
      <Provider store={mockStore}>
        <Mdblogin />
      </Provider>
    );

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput.value).toBe("test@mail.com");
    expect(passwordInput.value).toBe("123456");
  });


  test("successful login", async () => {
    const { _post } = await import("../../Socialmedia/axios/Axios");

    _post.mockResolvedValue({
      data: "user123",
    });

    render(
      <Provider store={mockStore}>
        <Mdblogin />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(_post).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/social");
    });
  });


  test("login failure shows error", async () => {
    const { _post } = await import("../../Socialmedia/axios/Axios");
    const { toast } = await import("react-toastify");

    _post.mockRejectedValue({
      response: { data: { message: "Invalid login" } },
    });

    render(
      <Provider store={mockStore}>
        <Mdblogin />
      </Provider>
    );

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

});