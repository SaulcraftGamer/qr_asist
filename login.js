const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "qr_asist",
  password: "2711", // 👈 pon tu contraseña real
  port: 5432
});

router.post("/", async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1 AND contrasena = $2",
      [usuario, contrasena]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;