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
    <div className="ranking-page bg-dark text-white min-vh-100 p-3">

      {/* Contenedor principal */}
      <div className="container mt-5">
        <h1 className="text-center mb-4">User Ranking</h1>

        {/* Tabla de Bootstrap */}
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>LVL</th>
                <th>XP Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.level}</td>
                  <td>{user.experiencePoints}</td>
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