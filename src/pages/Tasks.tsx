import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { logoutUser } from "../services/authService";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  async function handleSendSummary() {
    if (!user?.email) return;

    setSending(true);
    setEmailStatus("");

    try {
      const response = await fetch("/api/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: user.email, tasks }),
      });

      if (!response.ok) {
        throw new Error("Error en el envío");
      }

      setEmailStatus("Resumen enviado correctamente.");
    } catch {
      setEmailStatus("No se pudo enviar el resumen. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h1>Mis tareas</h1>
      <p>Sesión iniciada como: {user?.email}</p>
      <button onClick={() => logoutUser()}>Cerrar sesión</button>

      <TodoForm />

      {loading ? <p>Cargando tareas...</p> : <TodoList tasks={tasks} />}

      <hr />
      <button onClick={handleSendSummary} disabled={sending || tasks.length === 0}>
        {sending ? "Enviando..." : "Enviar resumen por email"}
      </button>
      {emailStatus && <p>{emailStatus}</p>}
    </div>
  );
}