import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axiosConfig";
import UserInfo from "./UserInfo";
import "../css/HomePage.css";

const Info = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al obtener los datos del usuario");
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div id="info-container" className="info-container">
      <div id="user-info-section" className="user-info-section">
        <UserInfo user={user} />
      </div>
    </div>

  );
};

export default Info;
