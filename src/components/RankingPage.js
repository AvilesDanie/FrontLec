// RankingPage.js
import React, { useEffect, useState } from "react";
import axios from "../services/axiosConfig";
import { useParams } from 'react-router-dom';
import '../css/RankingPage.css';



const RankingPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    // Obtener usuarios desde el backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        // Ordenar usuarios por nivel y puntos de experiencia
        const sortedUsers = response.data.sort(
          (a, b) => b.level - a.level || b.experiencePoints - a.experiencePoints
        );
        setUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        setError("Error loading ranking data.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id="ranking-page" className="ranking-page bg-dark text-white min-vh-100 p-3">
      {/* Contenedor principal */}
      <div id="ranking-container" className="container mt-5">
        <h1 id="ranking-title" className="text-center mb-4">User Ranking</h1>

        {/* Tabla de Bootstrap */}
        <div id="ranking-table-container" className="table-responsive">
          <table id="ranking-table" className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th id="ranking-header-rank">#</th>
                <th id="ranking-header-user">User</th>
                <th id="ranking-header-level">LVL</th>
                <th id="ranking-header-xp">XP Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} id={`ranking-row-${index + 1}`}>
                  <td className="ranking-rank">{index + 1}</td>
                  <td className="ranking-username">{user.username}</td>
                  <td className="ranking-level">{user.level}</td>
                  <td className="ranking-xp">{user.experiencePoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default RankingPage;