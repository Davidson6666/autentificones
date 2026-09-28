import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname ?? "/restrita";

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(traduzErro(signInError.message));
      setSubmitting(false);
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div className="page">
      <h1>Entrar</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={submitting}
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={submitting}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}

function traduzErro(mensagem) {
  if (mensagem === "Invalid login credentials") {
    return "E-mail ou senha incorretos. Tente novamente.";
  }
  if (mensagem === "Email not confirmed") {
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  }
  return mensagem;
}
