import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RestrictedPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="page">
      <h1>Área restrita</h1>
      <p>Esta página só pode ser vista por usuários autenticados.</p>
      <p>
        Você está conectado como: <strong>{user?.email}</strong>
      </p>
      <button type="button" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
}
