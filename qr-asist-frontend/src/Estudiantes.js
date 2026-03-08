import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Estudiantes.css"; // 👈 estilos aplicados

function Estudiantes() {
  const { id } = useParams(); // curso_id

  const [curso, setCurso] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [nuevoEstudiante, setNuevoEstudiante] = useState(null);

  useEffect(() => {
    cargarCurso();
    cargarEstudiantes();
  }, []);

  const cargarCurso = () => {
    fetch(`http://localhost:3000/cursos/${id}`)
      .then(res => res.json())
      .then(data => setCurso(data))
      .catch(err => console.error("Error cargando curso:", err));
  };

  const cargarEstudiantes = () => {
    fetch(`http://localhost:3000/cursos/${id}/estudiantes`)
      .then(res => res.json())
      .then(async data => {
        const estudiantesConAsistencias = await Promise.all(
          data.map(async (est) => {
            const res = await fetch(`http://localhost:3000/estudiantes/${est.id}/asistencias`);
            const asistencias = await res.json();
            return { ...est, asistencias };
          })
        );
        const ordenados = estudiantesConAsistencias.sort((a, b) => {
          const cedulaA = a.cedula || "";
          const cedulaB = b.cedula || "";
          return cedulaA.localeCompare(cedulaB);
        });
        setEstudiantes(ordenados);
      })
      .catch(err => console.error("Error cargando estudiantes:", err));
  };

  const guardarEstudiante = (est) => {
    if (est.id) {
      fetch(`http://localhost:3000/estudiantes/${est.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_lista: est.numero_lista, cedula: est.cedula, nombre: est.nombre })
      })
        .then(res => res.json())
        .then(() => cargarEstudiantes())
        .catch(err => console.error("Error actualizando estudiante:", err));
    } else {
      fetch(`http://localhost:3000/cursos/${id}/estudiantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: est.nombre,
          numero_lista: estudiantes.length + 1,
          cedula: est.cedula
        })
      })
        .then(res => res.json())
        .then(() => {
          setNuevoEstudiante(null);
          cargarEstudiantes();
        })
        .catch(err => console.error("Error creando estudiante:", err));
    }
  };

  const eliminarEstudiante = (estId) => {
    fetch(`http://localhost:3000/estudiantes/${estId}`, {
      method: "DELETE"
    })
      .then(() => cargarEstudiantes())
      .catch(err => console.error("Error eliminando estudiante:", err));
  };

  const estuvoPresente = (asistencias, diaSemana) => {
    const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
    const hoy = new Date();
    const lunes = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1));
    const fechaDia = new Date(lunes);
    fechaDia.setDate(lunes.getDate() + dias.indexOf(diaSemana));
    const fechaStr = fechaDia.toISOString().split("T")[0];

    return asistencias.some(a => a.fecha === fechaStr && a.presente);
  };

  const toggleEditMode = () => {
    if (editMode) {
      estudiantes.forEach(est => guardarEstudiante(est));
    }
    setEditMode(!editMode);
  };

  return (
    <div className="estudiantes-container">
      {/* Título del curso arriba */}
      <h2 className="estudiantes-title">{curso ? curso.nombre : id}</h2>

      <table className="estudiantes-table">
        <thead>
          <tr>
            <th>Número de lista</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est, index) => (
            <tr key={est.id}>
              <td>{index + 1}</td>
              <td>
                {editMode ? (
                  <input
                    type="text"
                    defaultValue={est.cedula}
                    onChange={(e) => (est.cedula = e.target.value)}
                  />
                ) : (
                  est.cedula
                )}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="text"
                    defaultValue={est.nombre}
                    onChange={(e) => (est.nombre = e.target.value)}
                  />
                ) : (
                  est.nombre
                )}
              </td>
              {["Lunes","Martes","Miércoles","Jueves","Viernes"].map(dia => (
                <td key={dia} className="asistencia-cell">
                  {estuvoPresente(est.asistencias, dia) 
                    ? <span className="presente">✔</span> 
                    : <span className="pendiente">⏳</span>}
                </td>
              ))}
              <td>
                {editMode && (
                  <>
                    <button onClick={() => guardarEstudiante(est)}>💾</button>
                    <button onClick={() => eliminarEstudiante(est.id)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {nuevoEstudiante && (
            <tr>
              <td>{estudiantes.length + 1}</td>
              <td>
                <input
                  type="text"
                  placeholder="Cédula"
                  value={nuevoEstudiante.cedula}
                  onChange={(e) =>
                    setNuevoEstudiante({ ...nuevoEstudiante, cedula: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nuevoEstudiante.nombre}
                  onChange={(e) =>
                    setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })
                  }
                />
              </td>
              {["Lunes","Martes","Miércoles","Jueves","Viernes"].map(dia => (
                <td key={dia} className="asistencia-cell">
                  <span className="pendiente">⏳</span>
                </td>
              ))}
              <td>
                <button onClick={() => guardarEstudiante(nuevoEstudiante)}>💾</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Botón de editar/guardar cambios */}
      <button
        className="edit-btn"
        onClick={toggleEditMode}
      >
        {editMode ? "Guardar cambios" : "Editar"}
      </button>

      {/* Botón para añadir fila nueva solo en modo edición */}
      {editMode && (
        <button
          className="add-btn"
          onClick={() => setNuevoEstudiante({ nombre: "", cedula: "" })}
        >
          ➕
        </button>
      )}
    </div>
  );
}

export default Estudiantes;