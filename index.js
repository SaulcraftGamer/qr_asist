const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const apiRoutes = require("./routes/api");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "qr_asist",
  password: "2711", // 👈 pon tu contraseña real
  port: 5432
});

// ------------------ LOGIN ------------------
const loginRouter = require("./login");
app.use("/login", loginRouter);

// ------------------ CURSOS ------------------
// Obtener todos los cursos
app.get("/cursos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cursos");
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo cursos:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener curso por ID (para mostrar nombre en frontend)
app.get("/cursos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM cursos WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error obteniendo curso:", err);
    res.status(500).json({ error: err.message });
  }
});

// Crear curso
app.post("/cursos", async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO cursos (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creando curso:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar curso
app.delete("/cursos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM cursos WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error eliminando curso:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------ ESTUDIANTES ------------------
// Obtener estudiantes de un curso
app.get("/cursos/:id/estudiantes", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, nombre, numero_lista, cedula FROM estudiantes WHERE curso_id = $1 ORDER BY numero_lista",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo estudiantes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Agregar estudiante a un curso
app.post("/cursos/:id/estudiantes", async (req, res) => {
  const { id } = req.params;
  const { nombre, numero_lista, cedula } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO estudiantes (nombre, numero_lista, cedula, curso_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, numero_lista, cedula, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creando estudiante:", err);
    res.status(500).json({ error: err.message });
  }
});

// Editar estudiante (número de lista y cédula/nombre)
app.put("/estudiantes/:id", async (req, res) => {
  const { id } = req.params;
  const { numero_lista, cedula, nombre } = req.body;
  try {
    const result = await pool.query(
      "UPDATE estudiantes SET numero_lista = $1, cedula = $2, nombre = $3 WHERE id = $4 RETURNING *",
      [numero_lista, cedula, nombre, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error actualizando estudiante:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar estudiante
app.delete("/estudiantes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM estudiantes WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error eliminando estudiante:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------ ASISTENCIAS ------------------
// Obtener asistencias de un estudiante
app.get("/estudiantes/:id/asistencias", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM asistencias WHERE estudiante_id = $1 ORDER BY fecha",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo asistencias:", err);
    res.status(500).json({ error: err.message });
  }
});

// Registrar asistencia
app.post("/estudiantes/:id/asistencias", async (req, res) => {
  const { id } = req.params;
  const { fecha, presente } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO asistencias (estudiante_id, fecha, presente) VALUES ($1, $2, $3) RETURNING *",
      [id, fecha, presente]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error registrando asistencia:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------ PROFESORES ------------------

// Obtener todos los profesores
app.get("/profesores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM profesores ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo profesores:", err);
    res.status(500).json({ error: err.message });
  }
});

// Crear profesor
app.post("/profesores", async (req, res) => {
  const { nombre, usuario, contraseña } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO profesores (nombre, usuario, contraseña) VALUES ($1, $2, $3) RETURNING *",
      [nombre, usuario, contraseña]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creando profesor:", err);
    res.status(500).json({ error: err.message });
  }
});

// Editar profesor
app.put("/profesores/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, usuario, contraseña } = req.body;
  try {
    const result = await pool.query(
      "UPDATE profesores SET nombre = $1, usuario = $2, contraseña = $3 WHERE id = $4 RETURNING *",
      [nombre, usuario, contraseña, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error actualizando profesor:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar profesor
app.delete("/profesores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM profesores WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error eliminando profesor:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener cursos asignados a un profesor en un día
app.get("/profesores/:id/cursos", async (req, res) => {
  const { id } = req.params;
  const { dia } = req.query; // ejemplo: ?dia=Lunes
  try {
    const result = await pool.query(
      "SELECT pc.*, c.nombre FROM profesor_cursos pc JOIN cursos c ON pc.curso_id = c.id WHERE profesor_id = $1 AND dia = $2",
      [id, dia]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo cursos del profesor:", err);
    res.status(500).json({ error: err.message });
  }
});

// Asignar curso a un profesor en un día
app.post("/profesores/:id/cursos", async (req, res) => {
  const { id } = req.params;
  const { curso_id, dia, hora_inicio, hora_fin } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO profesor_cursos (profesor_id, curso_id, dia, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, curso_id, dia, hora_inicio, hora_fin]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error asignando curso:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar curso asignado a un profesor
app.delete("/profesores/:id/cursos/:cursoId", async (req, res) => {
  const { id, cursoId } = req.params;
  try {
    await pool.query(
      "DELETE FROM profesor_cursos WHERE profesor_id = $1 AND curso_id = $2",
      [id, cursoId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error eliminando curso asignado:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener un profesor por ID
app.get("/profesores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM profesores WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error obteniendo profesor:", err);
    res.status(500).json({ error: err.message });
  }
});

// Rutas API
app.use("/api", apiRoutes);

// ------------------ INICIO DEL SERVIDOR ------------------
app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
});