// components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css'; // Importa el archivo CSS



const NavBar = ({ userId }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top w-100" style={{ backgroundColor: '#1e3c72' }} id="navbar">
      {/* Logo o nombre de la aplicación */}
      <Link className="navbar-brand ms-3" to={`/user/${userId}`} id="navbar-brand">🎮 GameConsole</Link>
    
      {/* Botón para colapsar el menú en dispositivos móviles */}
      <button
        className="navbar-toggler me-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        id="navbar-toggler"
      >
        <span className="navbar-toggler-icon" id="navbar-toggler-icon"></span>
      </button>
    
      {/* Contenedor del menú colapsable */}
      <div className="collapse navbar-collapse w-100" id="navbarNav">
        <ul className="navbar-nav ms-auto me-3" id="navbar-nav">
          <li className="nav-item mx-2 my-1" id="home-item">
            <Link className="nav-link btn btn-outline-light text-dark" to={`/user/${userId}`} id="home-link">
              <i className="fas fa-home" id="home-icon"></i> Home
            </Link>
          </li>
          <li className="nav-item mx-2 my-1" id="ranking-item">
            <Link className="nav-link btn btn-outline-light text-dark" to={`/user/${userId}/ranking`} id="ranking-link">
              <i className="fas fa-trophy" id="ranking-icon"></i> Ranking
            </Link>
          </li>
          <li className="nav-item mx-2 my-1" id="profile-item">
            <Link className="nav-link btn btn-outline-light text-dark" to={`/user/${userId}/info`} id="profile-link">
              <i className="fas fa-user" id="profile-icon"></i> Profile
            </Link>
          </li>
          <li className="nav-item mx-2 my-1" id="exit-item">
            <Link className="nav-link btn btn-outline-light text-dark" to="/" id="exit-link">
              <i className="fas fa-cogs" id="exit-icon"></i> Exit
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
