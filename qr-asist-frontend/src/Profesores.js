import React, { useState, useEffect } from "react";
import "./Profesores.css"; // 👈 estilos aplicados

function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: "",
    usuario: "",
    contraseña: ""
  });

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = () => {
    fetch("http://localhost:3000/profesores")
      .then(res => res.json())
      .then(data => setProfesores(data))
      .catch(err => console.error("Error cargando profesores:", err));
  };

  const crearProfesor = () => {
    fetch("http://localhost:3000/profesores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProfesor)
    })
      .then(res => res.json())
      .then(() => {
        setShowModal(false);
        setNuevoProfesor({ nombre: "", usuario: "", contraseña: "" });
        cargarProfesores();
      })
      .catch(err => console.error("Error creando profesor:", err));
  };

  const eliminarProfesor = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este profesor?")) {
      fetch(`http://localhost:3000/profesores/${id}`, {
        method: "DELETE"
      })
        .then(() => cargarProfesores())
        .catch(err => console.error("Error eliminando profesor:", err));
    }
  };

  return (
    <div className="profesores-container">
      <h2 className="profesores-title">Profesores</h2>

      <table className="profesores-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map(prof => (
            <tr key={prof.id}>
              <td
                className="profesor-link"
                onClick={() => window.location.href = `/profesor/${prof.id}`}
              >
                {prof.nombre}
              </td>
              <td>{prof.usuario}</td>
              <td>
                <button className="delete-btn" onClick={() => eliminarProfesor(prof.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón para abrir modal */}
      <button className="edit-btn" onClick={() => setShowModal(true)}>
        Añadir cuenta
      </button>

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="modal">
          <h3>Crear cuenta de profesor</h3>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nuevoProfesor.nombre}
              onChange={(e) =>
                setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })
              }
            />
          </div>
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={nuevoProfesor.usuario}
              onChange={(e) =>
                setNuevoProfesor({ ...nuevoProfesor, usuario: e.target.value })
              }
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={nuevoProfesor.contraseña}
              onChange={(e) =>
                setNuevoProfesor({ ...nuevoProfesor, contraseña: e.target.value })
              }
            />
          </div>

          <div className="modal-actions">
            <button className="create-btn" onClick={crearProfesor}>Crear</button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profesores;