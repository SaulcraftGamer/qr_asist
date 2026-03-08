import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token"); // limpia sesión
    navigate("/login"); // redirige al login
  };

  return (
    <div>
      {/* Barra superior */}
      <nav className="navbar">
        <img 
          src="/logo.png" 
          alt="QR Asist Logo" 
          className="navbar-logo" 
          onClick={toggleSidebar} 
        />
      </nav>

      {/* Barra lateral */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img 
            src="/logo.png" 
            alt="QR Asist Logo" 
            className="sidebar-logo" 
            onClick={toggleSidebar} 
          />
        </div>

        <h4>Menú</h4>
        <ul>
          <li><Link to="/inicio" onClick={toggleSidebar}>🏠 Inicio</Link></li>
          <li><Link to="/cursos" onClick={toggleSidebar}>📚 Cursos</Link></li>
          <li><Link to="/profesores" onClick={toggleSidebar}>👨‍🏫 Profesores</Link></li>
          <li><Link to="/reportes" onClick={toggleSidebar}>📊 Reportes</Link></li>
        </ul>

        {/* Botón de cerrar sesión */}
        <div className="logout-section">
  <button 
    className="logout-btn" 
    onClick={cerrarSesion} 
    title="Cerrar sesión"
  >
    <img 
      src="/sesion.png"   // tu ícono en public/
      alt="Cerrar sesión" 
      className="logout-icon" 
    />
  </button>
</div>
      </div>
    </div>
  );
}

export default Navbar;