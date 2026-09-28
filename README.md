# Trabalho Autenticação

Aplicação React (Vite) que usa **Supabase Auth** para cadastro e login por
e-mail e senha, com controle de acesso entre uma página pública e uma página
restrita.

## Como instalar, configurar e executar

1. Instale as dependências:
   ```
   npm install
   ```
2. Configure as variáveis de ambiente (veja a seção abaixo) criando um
   arquivo `.env.local` a partir de `.env.example`.
3. Rode o projeto em modo de desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse o endereço mostrado no terminal (por padrão,
   `http://localhost:5173`).

## Variáveis de ambiente

O arquivo `.env.example` traz o modelo, sem credenciais preenchidas:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

- `VITE_SUPABASE_URL`: URL do projeto Supabase.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: chave pública (publishable/anon) do
  projeto, segura para uso no navegador. **Nunca** coloque a chave
  `service_role` (secreta/administrativa) no código do front-end — ela nunca
  é usada nesta aplicação.

Crie um arquivo `.env.local` (ignorado pelo Git) com os valores reais do seu
projeto Supabase antes de rodar a aplicação.

## Configuração necessária no Supabase

1. Crie um projeto no [Supabase](https://supabase.com) e copie a URL e a
   chave publicável em **Project Settings → API**.
2. Em **Authentication → Providers**, mantenha o provedor **Email**
   habilitado (é o único usado neste trabalho).
3. Em **Authentication → Settings → Email**, decida sobre a **confirmação de
   e-mail**:
   - **Confirmação habilitada (padrão do Supabase)**: depois do cadastro, o
     usuário recebe um e-mail e só consegue fazer login após confirmar. A
     tela de cadastro desta aplicação já detecta esse caso (quando a
     resposta do `signUp` não traz uma sessão) e exibe a mensagem "Cadastro
     realizado! Verifique seu e-mail para confirmar a conta antes de
     entrar.".
   - **Confirmação desabilitada**: o usuário já é autenticado imediatamente
     após o cadastro e é redirecionado direto para a área restrita.
   - Este projeto funciona corretamente nos dois modos; não é necessário
     nenhum ajuste de código para trocar entre eles, apenas a configuração
     no painel do Supabase.
4. Não é necessário criar tabelas, políticas de RLS ou APIs adicionais: a
   página restrita apenas exibe dados do usuário autenticado, obtidos
   diretamente da sessão do Supabase Auth.

## Como a sessão é controlada e como a autorização é aplicada

- O cliente do Supabase (`src/lib/supabaseClient.js`) é configurado com a
  chave pública e, por padrão, persiste a sessão no `localStorage` do
  navegador.
- `src/context/AuthContext.jsx` centraliza o estado de autenticação:
  - Ao carregar a aplicação, chama `supabase.auth.getSession()` para
    recuperar uma sessão já existente (o que garante a continuidade da
    sessão após recarregar a página) e mantém um estado `loading` enquanto
    essa verificação não termina — usado para exibir "Verificando sessão..."
    em vez de mostrar indevidamente a página restrita ou redirecionar cedo
    demais para o login.
  - Assina `supabase.auth.onAuthStateChange`, que atualiza o estado sempre
    que o usuário faz login, logout ou a sessão expira, mantendo toda a
    interface sincronizada em tempo real.
  - Expõe as funções `signUp`, `signIn` e `signOut`, que chamam
    respectivamente `supabase.auth.signUp`, `signInWithPassword` e
    `signOut`.
- `src/components/ProtectedRoute.jsx` implementa a **autorização** de rotas:
  - Enquanto `loading` é verdadeiro, mostra uma tela de carregamento.
  - Se não existe sessão, redireciona para `/login` (usando `<Navigate>` do
    React Router), sem chegar a renderizar o conteúdo restrito.
  - Se existe sessão, renderiza a página restrita normalmente.
  - Como essa verificação acontece a cada renderização com base no estado
    de sessão em memória (e não em algo assistido pelo cache do navegador),
    voltar pelo botão do navegador ou recarregar a página restrita depois do
    logout também é bloqueado: o `ProtectedRoute` roda de novo, vê que não
    há sessão e redireciona para o login.
- A rota `/restrita` é a única protegida por `ProtectedRoute`; `/`
  (pública), `/login` e `/cadastro` são sempre acessíveis, e a página
  pública ajusta apenas os links exibidos conforme o usuário está ou não
  autenticado.

## Autenticação x autorização, aplicadas nesta solução

- **Autenticação** responde "quem é você": aqui, é o processo de cadastro e
  login por e-mail e senha feito pelo Supabase Auth, que verifica as
  credenciais e devolve uma sessão (tokens) quando elas são válidas.
- **Autorização** responde "o que você pode acessar": neste trabalho, a
  regra é simples e igual para todos os usuários autenticados — qualquer
  pessoa com uma sessão válida pode ver a página restrita, e qualquer pessoa
  (autenticada ou não) pode ver a página pública. Essa decisão é tomada pelo
  `ProtectedRoute`, que lê o estado de autenticação e decide se libera ou
  redireciona.
- As duas coisas são independentes: estar autenticado não seria suficiente,
  em um sistema com múltiplos perfis, para acessar qualquer recurso — aqui
  isso não é um problema porque todos os usuários autenticados têm o mesmo
  nível de acesso, mas a distinção conceitual continua valendo. Também vale
  notar que o controle de rotas do React Router organiza apenas a interface;
  como este trabalho não expõe API própria nem tabelas privadas, a única
  fonte de verdade sobre "quem está autenticado" é a sessão validada pelo
  próprio Supabase Auth, e não uma variável local.

## Estrutura do projeto

- `src/lib/supabaseClient.js`: cria o cliente do Supabase a partir das
  variáveis de ambiente.
- `src/context/AuthContext.jsx`: estado global de autenticação (sessão,
  usuário, carregamento) e funções de cadastro/login/logout.
- `src/components/ProtectedRoute.jsx`: componente de rota protegida que
  aplica a regra de autorização.
- `src/components/Navbar.jsx`: barra de navegação com links que mudam
  conforme o usuário está ou não autenticado.
- `src/pages/PublicPage.jsx`: página pública.
- `src/pages/SignupPage.jsx`: formulário de cadastro.
- `src/pages/LoginPage.jsx`: formulário de login.
- `src/pages/RestrictedPage.jsx`: página restrita, exibe o e-mail do usuário
  e o botão de logout.

## Referências consultadas

- [Documentação do Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase JS: `signUp`](https://supabase.com/docs/reference/javascript/auth-signup)
- [Supabase JS: `signInWithPassword`](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Supabase JS: `onAuthStateChange`](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
- [React Router: rotas protegidas](https://reactrouter.com/en/main/start/tutorial)
- [Vite: variáveis de ambiente](https://vitejs.dev/guide/env-and-mode.html)
