import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">
        Trabalho Autenticação
      </Link>
      <div className="navbar-links">
        <Link to="/">Início</Link>
        {session ? (
          <>
            <Link to="/restrita">Área restrita</Link>
            <button type="button" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}
