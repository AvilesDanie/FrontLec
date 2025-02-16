import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Game1.css'; // Importar el archivo CSS

const Game1Exercise = () => {
  const { exerciseId } = useParams(); // Captura el codewarsId desde la URL
  const [exercise, setExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lines, setLines] = useState([]);
  const [orderedLines, setOrderedLines] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]); // Estado para los ejercicios completados

  const { userId } = useParams(); // ID del usuario (ajustar si es necesario)
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  // Obtener detalles del ejercicio y usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener detalles del ejercicio
        const exerciseRes = await axios.get(`/exercises/codewars/${exerciseId}`);
        setExercise(exerciseRes.data);

        // Obtener detalles del ejercicio desde Codewars
        const exerciseDetailsRes = await axios.get(`/codewars/challenge/${exerciseId}`);
        setExerciseDetails(exerciseDetailsRes.data);

        // Obtener los ejercicios completados del usuario
        const userResponse = await axios.get(`/users/${userId}`);
        setCompletedChallenges(userResponse.data.completedChallenges || []);

        setLoading(false);
      } catch (err) {
        setError('Error al obtener los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, userId]);

  // Configurar líneas del código
  useEffect(() => {
    if (exercise && exercise.answer && exercise.answer.python) {
      const codeLines = exercise.answer.python.split('\n');
      const shuffledLines = [...codeLines].sort(() => Math.random() - 0.5);
      setLines(shuffledLines);
      setOrderedLines(codeLines);
    }
  }, [exercise]);

  // Mover líneas de código
  const handleLineMove = (fromIndex, toIndex) => {
    const updatedLines = [...lines];
    const [movedLine] = updatedLines.splice(fromIndex, 1);
    updatedLines.splice(toIndex, 0, movedLine);
    setLines(updatedLines);
  };

  // Verificar respuesta del usuario
  const checkAnswer = () => {
    const userCode = lines.join('\n');
    const correctCode = orderedLines.join('\n');
    return userCode === correctCode;
  };

  // Verificar si el ejercicio ya está completado
  const isExerciseCompleted = () => {
    if (!exercise) return false; // Asegurarse de que el ejercicio esté cargado
    return completedChallenges.some((challenge) => challenge.toString() === exercise._id.toString());
  };

  // Manejo del resultado del juego
  const handleGameCompletion = async (isWin) => {
    try {
      // Verificar si el ejercicio ya está completado
      if (isExerciseCompleted()) {
        setGameResult(isWin ? 'win' : 'lose');
        return; // No sumar puntos si ya está completado
      }

      const payload = {
        userId,
        exerciseId,
        experiencePoints: isWin ? 100 : 0, // Sumar puntos solo si no está completado
        successful: isWin,
      };

      const response = await axios.put(`/users/progress-unified`, payload);

      // Verificar si el progreso alcanzó el 100% y reiniciar a 0%
      if (response.data.progress >= 100) {
        await axios.put(`/users/${userId}`, { progress: 0 });
      }

      setGameResult(isWin ? 'win' : 'lose');
    } catch (err) {
      console.error('Error al actualizar el progreso:', err);
    }
  };

  // Funciones de navegación
  const goToExerciseList = () => navigate(`/user/${userId}/game/game1`);
  const restartGame = () => {
    setGameResult(null);
    setLines([...orderedLines].sort(() => Math.random() - 0.5));
  };

  // Función para limpiar la descripción
  const removeTripleBackticksContent = (description) => {
    return description
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="exercise-container">
        <div className="exercise-info">
          <h1>{exerciseDetails?.name || 'Exercise'}</h1>
          <p>
            <div dangerouslySetInnerHTML={{ __html: removeTripleBackticksContent(exerciseDetails?.description) || 'No Description Available' }} />
          </p>
        </div>

        <div className="exercise-code">
          <h2>Arrange the Code</h2>
          <div className="code-lines">
            {lines.map((line, index) => (
              <div
                key={index}
                className="code-line"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('index', index)}
                onDrop={(e) => {
                  const fromIndex = parseInt(e.dataTransfer.getData('index'));
                  handleLineMove(fromIndex, index);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="completion-button">
          <button
            onClick={() => {
              if (checkAnswer()) {
                handleGameCompletion(true);
              } else {
                handleGameCompletion(false);
                alert('Please try again! The code is not correct.');
              }
            }}
          >
            Submit
          </button>
        </div>

        {gameResult && (
          <div className="result-modal">
            {gameResult === 'win' ? (
              <>
                <p>🎉 You won! 🎉</p>
                <button onClick={goToExerciseList}>Back to the list of exercises</button>
              </>
            ) : (
              <>
                <p>😢 You lost! 😢</p>
                <button onClick={restartGame}>Retry</button>
                <button onClick={goToExerciseList}>Back to the list of exercises</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game1Exercise;