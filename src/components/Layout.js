import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

const Layout = () => {
    const { userId } = useParams();
  const location = useLocation();

  // Ocultar el Navbar y Footer en la página de Login
  const hideLayout = location.pathname === "/";

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Solo muestra el NavBar y Footer si no estamos en Login */}
      {!hideLayout && 
      <NavBar userId={userId} className="fixed-top w-100"/>}

      {/* Contenido principal */}
      <main className="flex-grow-1">
        <Outlet /> {/* Renderiza las páginas dentro del Layout */}
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
