import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../css/ExerciseList.css';  // Importa el archivo CSS
import NavBar from './NavBar';
import axiosConfig from '../services/axiosConfig'; // Importa axiosConfig directamente

const ExerciseList = () => {
  const { gameMode } = useParams(); // Obtener el modo de juego desde la URL
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]); // Estado para los ejercicios completados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId } = useParams(); // Obtener el ID del usuario desde la URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener los ejercicios recomendados
        const exercisesResponse = await axiosConfig.get(`/exercises/recommendations/${userId}`);
        setExercises(exercisesResponse.data);

        // Obtener los datos del usuario para verificar los ejercicios completados
        const userResponse = await axiosConfig.get(`/users/${userId}`);
        setCompletedChallenges(userResponse.data.completedChallenges || []);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [gameMode, userId]);

  const handleExerciseSelect = (exerciseId) => {
    navigate(`/user/${userId}/game/${gameMode}/exercise/${exerciseId}`);
  };

  const removeTripleBackticksContent = (str) => {
    return str
      .replace(/```[\s\S]*?```/g, '')  // Elimina bloques de código entre ```
      .replace(/~~~[\s\S]*?~~~/g, '')  // Elimina bloques de código entre ~~~
      .replace(/`[^`]+`/g, '')         // Elimina texto entre comillas invertidas (`example`)
      .replace(/\*\*[^*]+\*\*/g, '')   // Elimina texto entre ** **
      .replace(/\[.*?\]\(.*?\)/g, '')   // Elimina enlaces en formato [texto](url)
      .replace(/####\s?.*/g, '')       // Elimina encabezados "####"
      .replace(/- Task:.*|Examples:.*|Note:.*|Bash Note:.*|See "Sample Tests".*/gi, '')  // Filtra secciones irrelevantes
      .replace(/\s+/g, ' ')            // Reduce espacios múltiples a uno solo
      .trim();                         // Elimina espacios iniciales y finales
  };

  // Función para verificar si un ejercicio está completado
  const isExerciseCompleted = (codewarsId) => {
    return completedChallenges.some((challenge) => challenge.toString() === codewarsId.toString());
  };

  if (loading) return <p>Loading recommended exercises...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div id="exercise-list-page">
      {/* Usar el componente NavBar */}
      <NavBar userId={userId} />
      <div id="exercise-list-container" className="exercise-list-container">
        <h1 id="exercise-list-title">{gameMode} - Recommended Exercises</h1>
        <ul id="exercise-list">
          {exercises.map((exercise) => {
            const isCompleted = isExerciseCompleted(exercise._id); // Verificar si el ejercicio está completado
            return (
              <li key={exercise.codewarsId} id={`exercise-${exercise.codewarsId}`} className="position-relative">
                <h3 id={`exercise-name-${exercise.codewarsId}`}>{exercise.name || "No Name Available"}</h3>
                <p id={`exercise-description-${exercise.codewarsId}`}>
                  <div>
                    {/* Renderizamos el HTML usando dangerouslySetInnerHTML */}
                    <div
                      id={`exercise-description-content-${exercise.codewarsId}`}
                      dangerouslySetInnerHTML={{
                        __html: removeTripleBackticksContent(exercise.description),
                      }}
                    />
                  </div>
                </p>
                {exercise.priority > 0 && (
                  <p id={`exercise-priority-${exercise.codewarsId}`} className="priority-high">Recommended Exercise.</p>
                )}
                {/* Mostrar el ícono de "visto" si el ejercicio está completado */}
                {isCompleted && (
                  <div id={`exercise-completed-icon-${exercise.codewarsId}`} className="position-absolute bottom-0 end-0 m-2">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '24px' }}></i>
                  </div>
                )}
                {/* Cambiar el texto y el color del botón si el ejercicio está completado */}
                <button
                  id={`exercise-button-${exercise.codewarsId}`}
                  className={`btn ${isCompleted ? "btn-success" : "btn-primary"}`}
                  onClick={() => handleExerciseSelect(exercise.codewarsId)}
                >
                  {isCompleted ? "Reintentar" : "Go to Exercise"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ExerciseList;