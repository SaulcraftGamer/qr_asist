import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProfesorDetalle.css"; // 👈 estilos aplicados

function ProfesorDetalle() {
  const { id } = useParams();
  const [profesor, setProfesor] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState("Lunes");
  const [cursosAsignados, setCursosAsignados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [selecciones, setSelecciones] = useState({});

  useEffect(() => {
    cargarProfesor();
    cargarCursosAsignados();
  }, [diaSeleccionado]);

  const cargarProfesor = () => {
    fetch(`http://localhost:3000/profesores/${id}`)
      .then(res => res.json())
      .then(data => setProfesor(data))
      .catch(err => console.error("Error cargando profesor:", err));
  };

  const cargarCursosAsignados = () => {
    fetch(`http://localhost:3000/profesores/${id}/cursos?dia=${diaSeleccionado}`)
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
        setCursosAsignados(ordenados);
      })
      .catch(err => console.error("Error cargando cursos asignados:", err));
  };

  const cargarCursosDisponibles = () => {
    fetch("http://localhost:3000/cursos")
      .then(res => res.json())
      .then(data => setCursosDisponibles(data))
      .catch(err => console.error("Error cargando cursos:", err));
  };

  const asignarCursos = () => {
    Object.entries(selecciones).forEach(([cursoId, horas]) => {
      if (horas.inicio && horas.fin) {
        fetch(`http://localhost:3000/profesores/${id}/cursos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            curso_id: cursoId,
            dia: diaSeleccionado,
            hora_inicio: horas.inicio,
            hora_fin: horas.fin
          })
        })
          .then(() => cargarCursosAsignados())
          .catch(err => console.error("Error asignando curso:", err));
      }
    });
    setShowModal(false);
    setSelecciones({});
  };

  const actualizarCurso = (cursoId, horas) => {
    fetch(`http://localhost:3000/profesores/${id}/cursos/${cursoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dia: diaSeleccionado,
        hora_inicio: horas.hora_inicio,
        hora_fin: horas.hora_fin
      })
    })
      .then(() => cargarCursosAsignados())
      .catch(err => console.error("Error actualizando curso:", err));
  };

  const eliminarCurso = (cursoId) => {
    fetch(`http://localhost:3000/profesores/${id}/cursos/${cursoId}`, {
      method: "DELETE"
    })
      .then(() => cargarCursosAsignados())
      .catch(err => console.error("Error eliminando curso:", err));
  };

  return (
    <div className="profesor-detalle-container">
      {profesor && (
        <div className="profesor-info">
          <h2 className="profesor-title">{profesor.nombre}</h2>
          <p><strong>Usuario:</strong> {profesor.usuario}</p>
          <p><strong>Contraseña:</strong> {profesor.contraseña}</p>
        </div>
      )}

      <div className="dias-selector">
        {["Lunes","Martes","Miércoles","Jueves","Viernes"].map(dia => (
          <button
            key={dia}
            className={`dia-btn ${diaSeleccionado === dia ? "activo" : ""}`}
            onClick={() => setDiaSeleccionado(dia)}
          >
            {dia}
          </button>
        ))}
      </div>

      <h3 className="cursos-title">Cursos asignados el {diaSeleccionado}</h3>
      <ul className="cursos-list">
        {cursosAsignados.map(curso => (
          <li key={curso.id}>
            {curso.nombre} <span className="horario">({curso.hora_inicio} - {curso.hora_fin})</span>
          </li>
        ))}
      </ul>

      <div className="acciones">
        <button className="asignar-btn" onClick={() => { cargarCursosDisponibles(); setShowModal(true); }}>
          Asignar cursos
        </button>
        <button className="modificar-btn" onClick={() => setShowEditModal(true)}>
          Modificar cursos
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <h3>Asignar cursos</h3>
          <table className="asignar-table">
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>Curso</th>
                <th>Hora inicio</th>
                <th>Hora fin</th>
              </tr>
            </thead>
            <tbody>
              {cursosDisponibles.map(curso => (
                <tr key={curso.id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelecciones({
                            ...selecciones,
                            [curso.id]: { inicio: "", fin: "" }
                          });
                        } else {
                          const copia = { ...selecciones };
                          delete copia[curso.id];
                          setSelecciones(copia);
                        }
                      }}
                    />
                  </td>
                  <td>{curso.nombre}</td>
                  <td>
                    {selecciones[curso.id] && (
                      <input
                        type="time"
                        onChange={(e) =>
                          setSelecciones({
                            ...selecciones,
                            [curso.id]: { ...selecciones[curso.id], inicio: e.target.value }
                          })
                        }
                      />
                    )}
                  </td>
                  <td>
                    {selecciones[curso.id] && (
                      <input
                        type="time"
                        onChange={(e) =>
                          setSelecciones({
                            ...selecciones,
                            [curso.id]: { ...selecciones[curso.id], fin: e.target.value }
                          })
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="modal-actions">
            <button className="guardar-btn" onClick={asignarCursos}>Guardar</button>
            <button className="cancelar-btn" onClick={() => { setSelecciones({}); setShowModal(false); }}>Cancelar</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <h3>{diaSeleccionado}</h3>
          {cursosAsignados.map(curso => (
            <div key={curso.id} className="curso-edit">
              <span>{curso.nombre}</span>
              <input
                type="time"
                defaultValue={curso.hora_inicio}
                onChange={(e) =>
                  actualizarCurso(curso.curso_id, { hora_inicio: e.target.value, hora_fin: curso.hora_fin })
                }
              />
              <input
                type="time"
                defaultValue={curso.hora_fin}
                onChange={(e) =>
                  actualizarCurso(curso.curso_id, { hora_inicio: curso.hora_inicio, hora_fin: e.target.value })
                }
              />
              <button className="delete-btn" onClick={() => eliminarCurso(curso.curso_id)}>🗑️</button>
            </div>
          ))}

          <div className="modal-actions">
            <button className="cancelar-btn" onClick={() => setShowEditModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfesorDetalle;