const express = require("express");
const router = express.Router();
const db = require("../db"); // conexión con pg (Pool)

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const result = await db.query(
      "SELECT id FROM profesores WHERE usuario = $1 AND contraseña = $2",
      [usuario, contrasena]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, profesorId: result.rows[0].id });
    } else {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ---------------- PROFESOR POR ID ----------------
router.get("/profesores/:id", async (req, res) => {
  const profesorId = Number(req.params.id);
  if (isNaN(profesorId)) {
    return res.status(400).json({ error: "ID de profesor inválido" });
  }

  try {
    const result = await db.query(
      "SELECT id, nombre FROM profesores WHERE id = $1",
      [profesorId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // devuelve { id: 1, nombre: "Juan Pérez" }
    } else {
      res.status(404).json({ error: "Profesor no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ---------------- CURSO DEL PROFESOR HOY ----------------
router.get("/profesores/:id/curso-hoy", async (req, res) => {
  const profesorId = Number(req.params.id);
  if (isNaN(profesorId)) {
    return res.status(400).json({ error: "ID de profesor inválido" });
  }

  try {
    const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    const hoy = dias[new Date().getDay()];

    const result = await db.query(
      `SELECT c.id, c.nombre, pc.dia, pc.hora_inicio, pc.hora_fin
       FROM profesor_cursos pc
       JOIN cursos c ON c.id = pc.curso_id
       WHERE pc.profesor_id = $1 AND pc.dia = $2`,
      [profesorId, hoy]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ---------------- ESTUDIANTES DEL CURSO ----------------
router.get("/cursos/:id/estudiantes", async (req, res) => {
  const cursoId = Number(req.params.id);
  if (isNaN(cursoId)) {
    return res.status(400).json({ error: "ID de curso inválido" });
  }

  try {
    const result = await db.query(
      "SELECT id, nombre, qr_id, numero_lista, cedula FROM estudiantes WHERE curso_id = $1",
      [cursoId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ---------------- REGISTRAR ASISTENCIA ----------------
router.post("/asistencia", async (req, res) => {
  const estudianteId = Number(req.body.estudianteId);
  if (isNaN(estudianteId)) {
    return res.status(400).json({ error: "ID de estudiante inválido" });
  }

  const { fecha, estado } = req.body;
  try {
    await db.query(
      "INSERT INTO asistencias (estudiante_id, fecha, estado) VALUES ($1, $2, $3)",
      [estudianteId, fecha, estado || "presente"]
    );
    res.json({ success: true, message: "Asistencia registrada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ---------------- REPORTES ----------------
router.post("/reportes", async (req, res) => {
  const profesorId = Number(req.body.profesorId);
  const cursoId = Number(req.body.cursoId);

  if (isNaN(profesorId) || isNaN(cursoId)) {
    return res.status(400).json({ error: "ID de profesor o curso inválido" });
  }

  const { texto, estado } = req.body;
  try {
    await db.query(
      "INSERT INTO reportes (profesor_id, curso_id, texto, estado, fecha_hora) VALUES ($1, $2, $3, $4, NOW())",
      [profesorId, cursoId, texto, estado || "pendiente"]
    );
    res.json({ success: true, message: "Reporte enviado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/reportes", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, profesor_id, curso_id, texto, estado, fecha_hora FROM reportes"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;