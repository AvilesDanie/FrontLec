import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserInfo from "./UserInfo";
import "../css/HomePage.css";
import { Link } from "react-router-dom";

const Info = () => {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://backlec-production.up.railway.app/api/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al obtener los datos del usuario");
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleGameSelection = (gameMode) => {
    navigate(`/user/${userId}/game/${gameMode}`);
  };

  const handleShowUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="info-container">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />
      <nav className="game-navbar">
        <div className="logo">🎮 GameConsole</div>
        <ul className="nav-links">
          <li><Link to={`/user/${userId}`}><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to={`/user/${userId}/ranking`}><i className="fas fa-trophy"></i> Ranking</Link></li>
          <li><Link to={`/user/${userId}/info`}><i className="fas fa-user"></i> Profile</Link></li>
          <li><Link to="/"><i className="fas fa-cogs"></i> Exit</Link></li>
        </ul>
      </nav>
      <div className="user-info-section">
        <UserInfo user={user} />
      </div>
    </div>
  );
};

export default Info;
