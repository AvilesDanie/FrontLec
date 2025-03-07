import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/axiosConfig";
import '../css/HomePage.css';


const HomePage = () => {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [user, setUser] = useState(null);  // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId } = useParams(); // Reemplázalo con el ID dinámico o de la sesión

  // Función para obtener los datos del usuario desde el backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/users/${userId}`);
      setUser(response.data);  // Establecer los datos del usuario
      setLoading(false);
    } catch (err) {
      setError("Error al obtener los datos del usuario");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);  // Llamar a la función cuando el componente se monta

  const handleGameSelection = (gameMode) => {
    navigate(`/user/${userId}/game/${gameMode}`);
  };

  const handleShowUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id="home-page" className="home-page bg-dark text-white min-vh-100 p-3">
      {/* Contenedor principal */}
      <div id="main-container" className="container mt-5">
        <h1 id="title" className="text-center mb-4">Choose a Game Mode</h1>

        {/* Fila para los botones de selección de juego */}
        <div id="game-modes-row" className="row justify-content-center">
          <div id="mode-1" className="col-md-6 col-lg-4 mb-4">
            <div className="card bg-secondary text-white game-card">
              <div className="card-body">
                <h5 id="mode-1-title" className="card-title">
                  Mode 1: Ordering Code Lines
                </h5>
                <p id="mode-1-description" className="card-text">
                  In this mode, you'll have to order code lines to complete the function.
                </p>
                <button
                  id="mode-1-button"
                  className="btn btn-primary btn-block"
                  style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
                  onClick={() => handleGameSelection("game1")}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>

          <div id="mode-2" className="col-md-6 col-lg-4 mb-4">
            <div className="card bg-secondary text-white game-card">
              <div className="card-body">
                <h5 id="mode-2-title" className="card-title">
                  Mode 2: Completing Missing Code
                </h5>
                <p id="mode-2-description" className="card-text">
                  In this mode, you need to fill in the missing parts of a code snippet.
                </p>
                <button
                  id="mode-2-button"
                  className="btn btn-success btn-block"
                  style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                  onClick={() => handleGameSelection("game2")}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>

          <div id="mode-3" className="col-md-6 col-lg-4 mb-4">
            <div className="card bg-secondary text-white game-card">
              <div className="card-body">
                <h5 id="mode-3-title" className="card-title">
                  Mode 3: Answer Selection
                </h5>
                <p id="mode-3-description" className="card-text">
                  In this mode, you need to select the correct answer based on a given problem.
                </p>
                <button
                  id="mode-3-button"
                  className="btn btn-warning btn-block"
                  style={{
                    backgroundColor: "#ffc107",
                    borderColor: "#ffc107",
                    color: "#000",
                  }}
                  onClick={() => handleGameSelection("game3")}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Imagen temática */}
        <div id="theme-image-container" className="text-center mt-5">
          <img
            id="theme-image"
            src="https://cdn.dribbble.com/userupload/19631674/file/original-fff325dde9f378ce681b4c9810a1f7fd.gif"
            alt="Game Theme"
            className="img-fluid rounded"
          />
          <p id="theme-description" className="text-muted mt-3">
            Explore the world of coding games!
          </p>
        </div>
      </div>
    </div>

  );
};

export default HomePage;