import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PublicPage() {
  const { session, loading } = useAuth();

  return (
    <div className="page">
      <h1>Bem-vindo ao Trabalho de Autenticação</h1>
      <p>
        Esta é a página pública da aplicação. Qualquer visitante pode acessá-la,
        estando ou não conectado, inclusive digitando o endereço diretamente no
        navegador.
      </p>
      <p>
        A aplicação usa <strong>Supabase Auth</strong> para cadastro e login
        por e-mail e senha. Depois de autenticado, você ganha acesso a uma
        página restrita que exibe seu e-mail.
      </p>

      {!loading && (
        <div className="actions">
          {session ? (
            <Link className="button" to="/restrita">
              Ir para a área restrita
            </Link>
          ) : (
            <>
              <Link className="button" to="/login">
                Entrar
              </Link>
              <Link className="button secondary" to="/cadastro">
                Criar conta
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
