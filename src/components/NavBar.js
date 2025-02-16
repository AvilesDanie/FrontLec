// components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css'; // Importa el archivo CSS

const NavBar = ({ userId }) => {
  return (
    <nav
      id="main-navbar"
      className="navbar navbar-expand-lg navbar-dark fixed-top w-100"
      style={{ backgroundColor: "#1e3c72" }}
    >
      {/* Logo o nombre de la aplicación */}
      <Link id="navbar-brand" className="navbar-brand ms-3" to={`/user/${userId}`}>
        <i className="fas fa-gamepad"></i> GameConsole
      </Link>

      {/* Botón para colapsar el menú en dispositivos móviles */}
      <button
        id="navbar-toggler"
        className="navbar-toggler me-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Contenedor del menú colapsable */}
      <div id="navbar-menu" className="collapse navbar-collapse w-100">
        <ul id="navbar-list" className="navbar-nav ms-auto me-3">
          <li id="nav-home" className="nav-item mx-2 my-1">
            <Link
              id="nav-home-link"
              className="nav-link btn btn-outline-light text-dark"
              to={`/user/${userId}`}
            >
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li id="nav-ranking" className="nav-item mx-2 my-1">
            <Link
              id="nav-ranking-link"
              className="nav-link btn btn-outline-light text-dark"
              to={`/user/${userId}/ranking`}
            >
              <i className="fas fa-trophy"></i> Ranking
            </Link>
          </li>
          <li id="nav-profile" className="nav-item mx-2 my-1">
            <Link
              id="nav-profile-link"
              className="nav-link btn btn-outline-light text-dark"
              to={`/user/${userId}/info`}
            >
              <i className="fas fa-user"></i> Profile
            </Link>
          </li>
          <li id="nav-exit" className="nav-item mx-2 my-1">
            <Link id="nav-exit-link" className="nav-link btn btn-outline-light text-dark" to="/">
              <i className="fas fa-sign-out-alt"></i> Exit
            </Link>
          </li>
        </ul>
      </div>
    </nav>

  );
};

export default NavBar;