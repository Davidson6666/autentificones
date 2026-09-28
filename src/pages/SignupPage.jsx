import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setInfo(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    const { data, error: signUpError } = await signUp(email, password);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Quando o e-mail já está cadastrado, o Supabase (com proteção contra
    // enumeração de e-mails) responde sem erro, mas com um array de
    // identities vazio.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError("Este e-mail já está cadastrado. Tente entrar.");
      return;
    }

    if (!data.session) {
      // Projeto exige confirmação de e-mail: ainda não há sessão.
      setInfo(
        "Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de entrar.",
      );
      return;
    }

    // Confirmação de e-mail desativada: já existe sessão, segue para a área restrita.
    navigate("/restrita", { replace: true });
  }

  return (
    <div className="page">
      <h1>Criar conta</h1>
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
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={submitting}
        />

        <label htmlFor="confirmPassword">Confirmar senha</label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={submitting}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="form-info" role="status">
            {info}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
