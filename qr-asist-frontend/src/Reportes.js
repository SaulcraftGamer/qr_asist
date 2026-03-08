import React, { useState, useEffect } from "react";
import "./Reportes.css"; // 👈 nuevo archivo de estilos

function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  useEffect(() => {
    cargarReportes();

    // Intervalo que limpia reportes vencidos cada minuto
    const interval = setInterval(() => {
      limpiarReportesVencidos();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const cargarReportes = () => {
    fetch("http://localhost:3000/reportes")
      .then(res => res.json())
      .then(data => {
        const reportesConEstado = data.map(r => ({
          ...r,
          estado: "pendiente",
          recibidoEn: null
        }));
        setReportes(reportesConEstado);
      })
      .catch(err => console.error("Error cargando reportes:", err));
  };

  const abrirReporte = (reporte) => {
    setReporteSeleccionado(reporte);
  };

  const cerrarReporte = () => {
    setReporteSeleccionado(null);
  };

  const marcarRecibido = () => {
    if (reporteSeleccionado) {
      const ahora = new Date().getTime();
      setReportes(reportes.map(r =>
        r.id === reporteSeleccionado.id
          ? { ...r, estado: "recibido", recibidoEn: ahora }
          : r
      ));
      setReporteSeleccionado(null);
    }
  };

  const limpiarReportesVencidos = () => {
    const ahora = new Date().getTime();
    setReportes(reportes.filter(r => {
      if (r.estado === "recibido" && r.recibidoEn) {
        const diferenciaHoras = (ahora - r.recibidoEn) / (1000 * 60 * 60);
        return diferenciaHoras < 24; // solo mantener si no han pasado 24h
      }
      return true; // mantener pendientes
    }));
  };

  return (
    <div className="reportes-container">
      <h2 className="reportes-title">Reportes recibidos</h2>
      <table className="reportes-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Hora</th>
            <th>Alerta</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((rep) => (
            <tr key={rep.id} onClick={() => abrirReporte(rep)}>
              <td>{rep.curso}</td>
              <td>{rep.hora}</td>
              <td className="alerta-cell">
                {rep.estado === "pendiente" ? (
                  <div className="alerta-pendiente">!</div>
                ) : (
                  <div className="alerta-recibido">✓</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pantalla emergente (modal) */}
      {reporteSeleccionado && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Detalles del reporte</h3>
            <p><strong>Curso:</strong> {reporteSeleccionado.curso}</p>
            <p><strong>Profesor:</strong> {reporteSeleccionado.profesor}</p>
            <p><strong>Fecha:</strong> {reporteSeleccionado.fecha}</p>
            <p><strong>Hora:</strong> {reporteSeleccionado.hora}</p>
            <hr />
            <h4>Descripción del problema</h4>
            <p>{reporteSeleccionado.descripcion}</p>

            <div className="modal-actions">
              <button className="cancelar-btn" onClick={cerrarReporte}>Cerrar</button>
              <button className="guardar-btn" onClick={marcarRecibido}>Recibido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reportes;