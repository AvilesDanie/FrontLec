import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Game3.css';  // Importar el archivo CSS

const Game3 = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [exercise1, setExercise1] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [correctSolution, setCorrectSolution] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // Temporizador de 30 segundos
  const [completedChallenges, setCompletedChallenges] = useState([]); // Estado para los ejercicios completados

  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exerciseRes = await axios.get(`/codewars/challenge/${exerciseId}`);
        setExercise(exerciseRes.data);

        const solutionRes = await axios.get(`/exercises/codewars/${exerciseId}`);
        setCorrectSolution(solutionRes.data.answer.python);
        setExercise1(solutionRes.data);

        const randomSolutionsRes = await axios.get(`/exercises/random/${exerciseId}`);
        const randomSolutions = randomSolutionsRes.data.map((item) => item.answer.python);

        const combinedSolutions = [...randomSolutions, solutionRes.data.answer.python];
        const shuffledSolutions = combinedSolutions.sort(() => Math.random() - 0.5);

        setSolutions(shuffledSolutions);

        // Obtener los ejercicios completados del usuario
        const userRes = await axios.get(`/users/${userId}`);
        setCompletedChallenges(userRes.data.completedChallenges || []);

        setLoading(false);
      } catch (err) {
        setError('Error al obtener los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, userId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameResult('timeout'); // Tiempo agotado
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpieza del intervalo
  }, []);

  // Verificar si el ejercicio ya está completado
  const isExerciseCompleted = () => {
    if (!exercise) return false; // Asegurarse de que el ejercicio esté cargado
    return completedChallenges.some((challenge) => challenge.toString() === exercise1._id.toString());
  };

  const handleButtonClick = async (selectedSolution) => {
    if (selectedSolution === correctSolution) {
      setGameResult('win');
      try {
        // Verificar si el ejercicio ya está completado
        if (isExerciseCompleted()) {
          return; // No sumar puntos si ya está completado
        }

        const payload = {
          userId,
          exerciseId,
          experiencePoints: 100, // Siempre sumar 100 puntos (sin bonificación por tiempo)
          successful: true, // Marcado como exitoso
        };

        const response = await axios.put(`/users/progress-unified`, payload);

        // Verificar si el progreso alcanzó el 100% y reiniciar a 0%
        if (response.data.progress >= 100) {
          await axios.put(`/users/${userId}`, { progress: 0 });
        }
      } catch (err) {
        console.error('Error al actualizar el progreso del usuario:', err);
        alert('Error al actualizar el progreso del usuario.');
      }
    } else {
      setGameResult('lose');
      try {
        await axios.put(`/users/progress-unified`, {
          userId,
          exerciseId, 
          experiencePoints: 0, // No se ganan puntos al fallar
          successful: false, // Marcado como fallo
        });
      } catch (err) {
        console.error('Error al registrar el fallo del usuario:', err);
      }
    }
  };

  const goToExerciseList = () => {
    navigate(`/user/${userId}/game/game3`);
  };

  const restartGame = () => {
    setGameResult(null);
    setTimeLeft(30); // Reiniciar el temporizador
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
      <div className="game-container">
        <div className="exercise-info">
          <h1>{exercise?.name}</h1>
          <p>
            {<div>
              <div dangerouslySetInnerHTML={{ __html: removeTripleBackticksContent(exercise?.description) }} />
            </div> || "No Description Available"}
          </p>
          <p><strong>Time remaining: {timeLeft} seconds</strong></p>
        </div>

        <div className="solutions">
          <h2>Select the correct solution:</h2>
          <br></br>
          <br></br>

          {solutions.map((solution, index) => (
            <button
              key={index}
              className={`solution-button ${gameResult && solution === correctSolution ? 'correct' : ''}`}
              onClick={() => handleButtonClick(solution)}
              disabled={!!gameResult} // Desactiva los botones si ya hay resultado
            >
              {solution}
            </button>
          ))}
        </div>

        {gameResult && (
          <div className="result-modal">
            {gameResult === 'win' ? (
              <>
                <p>You won! You got 100 XP.</p>
                <button onClick={goToExerciseList}>Back to the list of exercises</button>
              </>
            ) : gameResult === 'timeout' ? (
              <>
                <p>Time out! Please try again.</p>
                <button onClick={restartGame}>Retry</button>
              </>
            ) : (
              <>
                <p>You lost!</p>
                <button onClick={restartGame}>Retry</button>
                <button onClick={() => navigate(`/user/${userId}/game/game3`)}>Back to the list of exercises</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game3;