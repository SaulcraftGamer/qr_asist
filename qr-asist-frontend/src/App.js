import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./Dashboard";       // Lista de cursos
import Profesores from "./Profesores";
import ProfesorDetalle from "./ProfesorDetalle";
import Reportes from "./Reportes";
import Estudiantes from "./Estudiantes";   // detalle de curso
import Login from "./Login";               // 👈 añadimos el login
import Inicio from "./Inicio";             // 👈 corregido

function App() {
  const location = useLocation();

  return (
    <>
      {/* 👇 Navbar solo aparece si NO estás en /login */}
      {location.pathname !== "/login" && location.pathname !== "/" && <Navbar />}

      <Routes>
        {/* Pantalla de inicio de sesión */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* inicio */}
        <Route path="/inicio" element={<Inicio />} />

        {/* Cursos */}
        <Route path="/cursos" element={<Dashboard />} />
        <Route path="/curso/:id" element={<Estudiantes />} />

        {/* Profesores */}
        <Route path="/profesores" element={<Profesores />} />
        <Route path="/profesor/:id" element={<ProfesorDetalle />} />

        {/* Reportes */}
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </>
  );
}

export default App;