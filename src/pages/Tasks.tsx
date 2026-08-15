import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/authService";

export default function Tasks() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Mis tareas</h1>
      <p>Sesión iniciada como: {user?.email}</p>
      <button onClick={() => logoutUser()}>Cerrar sesión</button>
    </div>
  );
}