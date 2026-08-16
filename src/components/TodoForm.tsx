import { useState, type FormEvent } from "react";
import { createTask } from "../services/taskService";
import { useAuth } from "../hooks/useAuth";

export default function TodoForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!user) return;

    setSaving(true);
    try {
      await createTask(user.uid, title.trim(), description.trim());
      setTitle("");
      setDescription("");
    } catch {
      setError("No se pudo crear la tarea. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Descripción</label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={saving}>
        {saving ? "Guardando..." : "Agregar tarea"}
      </button>
    </form>
  );
}