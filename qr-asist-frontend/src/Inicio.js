import React from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      {/* Logo */}
      <img src="/logo.png" alt="Logo QR Asist" className="inicio-logo" />

      {/* Nombre completo del sistema */}
      <h1 className="inicio-title">QR Asist: conectando educación y tecnología</h1>

      {/* Botones de navegación */}
      <div className="inicio-buttons">
        <button onClick={() => navigate("/cursos")}>📚 Cursos</button>
        <button onClick={() => navigate("/profesores")}>👩‍🏫 Profesores</button>
        <button onClick={() => navigate("/reportes")}>📢 Reportes</button>
      </div>
    </div>
  );
}

export default Inicio;