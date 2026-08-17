import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoForm from "./TodoForm";

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { uid: "test-uid", email: "test@test.com" } }),
}));

vi.mock("../services/taskService", () => ({
  createTask: vi.fn(),
}));

describe("TodoForm", () => {
  it("muestra un error si se envía sin título", async () => {
    render(<TodoForm />);

    const submitButton = screen.getByRole("button", { name: /agregar tarea/i });
    fireEvent.click(submitButton);

    const error = await screen.findByText(/el título es obligatorio/i);
    expect(error).toBeInTheDocument();
  });

  it("renderiza los campos del formulario", () => {
    render(<TodoForm />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
  });
});