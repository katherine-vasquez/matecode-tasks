import { AuthProvider } from "./features/auth/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { logoutUser } from "./services/authService";
import Login from "./pages/Login";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <p>Sesión iniciada como: {user.email}</p>
      <button onClick={() => logoutUser()}>Cerrar sesión</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;