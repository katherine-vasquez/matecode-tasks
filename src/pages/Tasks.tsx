import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { logoutUser } from "../services/authService";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();

  return (
    <div>
      <h1>Mis tareas</h1>
      <p>Sesión iniciada como: {user?.email}</p>
      <button onClick={() => logoutUser()}>Cerrar sesión</button>

      <TodoForm />

      {loading ? <p>Cargando tareas...</p> : <TodoList tasks={tasks} />}
    </div>
  );
}