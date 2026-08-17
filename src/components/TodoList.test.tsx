import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TodoList from "./TodoList";
import type { Task } from "../types/task";

vi.mock("../services/taskService", () => ({
  deleteTask: vi.fn(),
  toggleTaskCompleted: vi.fn(),
  updateTask: vi.fn(),
}));

const mockTasks: Task[] = [
  {
    id: "1",
    userId: "test-uid",
    title: "Tarea de prueba",
    description: "Descripción de prueba",
    completed: false,
    createdAt: Date.now(),
  },
];

describe("TodoList", () => {
  it("muestra mensaje cuando no hay tareas", () => {
    render(<TodoList tasks={[]} />);
    expect(screen.getByText(/no tenés tareas todavía/i)).toBeInTheDocument();
  });

  it("renderiza las tareas recibidas", () => {
    render(<TodoList tasks={mockTasks} />);
    expect(screen.getByText("Tarea de prueba")).toBeInTheDocument();
    expect(screen.getByText("Descripción de prueba")).toBeInTheDocument();
  });
});