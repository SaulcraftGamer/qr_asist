import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [cursos, setCursos] = useState([]);
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = () => {
    fetch("http://localhost:3000/cursos")
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error("Error cargando cursos:", err));
  };

  const crearCurso = () => {
    fetch("http://localhost:3000/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre })
    })
      .then(() => {
        setNombre("");
        cargarCursos();
      })
      .catch(err => console.error("Error creando curso:", err));
  };

  const eliminarCurso = (id) => {
    fetch(`http://localhost:3000/cursos/${id}`, { method: "DELETE" })
      .then(() => cargarCursos())
      .catch(err => console.error("Error eliminando curso:", err));
  };

  return (
    <div className="dashboard-container">
      {/* Título arriba */}
      <h2 className="dashboard-title">Gestión de Cursos</h2>

      {/* Tabla de cursos */}
      <table className="cursos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td>{curso.id}</td>
              <td
                className="curso-link"
                onClick={() => navigate(`/curso/${curso.id}`)}
              >
                {curso.nombre}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => eliminarCurso(curso.id)}
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario de creación abajo a la derecha */}
      <div className="form-container">
        <input
          type="text"
          placeholder="Nombre del curso"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button className="tiny-btn" onClick={crearCurso}>➕</button>
      </div>
    </div>
  );
}

export default Dashboard;