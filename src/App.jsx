import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { PublicPage } from "./pages/PublicPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { RestrictedPage } from "./pages/RestrictedPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route
            path="/restrita"
            element={
              <ProtectedRoute>
                <RestrictedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
