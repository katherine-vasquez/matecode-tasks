import { useState } from "react";
import type { Task } from "../types/task";
import { deleteTask, toggleTaskCompleted, updateTask } from "../services/taskService";

export default function TodoList({ tasks }: { tasks: Task[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (tasks.length === 0) {
    return <p>No tenés tareas todavía.</p>;
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  }

  async function saveEdit(taskId: string) {
    await updateTask(taskId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    setEditingId(null);
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {editingId === task.id ? (
            <div>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <button onClick={() => saveEdit(task.id)}>Guardar</button>
              <button onClick={() => setEditingId(null)}>Cancelar</button>
            </div>
          ) : (
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompleted(task.id, task.completed)}
              />
              <strong
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </strong>
              <p>{task.description}</p>
              <button onClick={() => startEditing(task)}>Editar</button>
              <button onClick={() => deleteTask(task.id)}>Eliminar</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}