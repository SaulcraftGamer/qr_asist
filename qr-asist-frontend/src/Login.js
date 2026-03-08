import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 importamos navigate
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías validar usuario/contraseña si lo deseas
    navigate("/inicio"); // 👈 redirige al Dashboard
  };

  return (
    <div className="login-container">
      {/* Logo mal puesto, sin texto adicional */}
      <img 
        src="/logo.png" 
        alt="QR Asist Logo" 
        className="login-logo misaligned" 
      />

      {/* Formulario de acceso */}
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;