import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Game2.css';  // Importar el archivo CSS

const Game2Exercise = () => {
  const { exerciseId } = useParams(); // Captura el codewarsId desde la URL
  const [exercise, setExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [modifiedCode, setModifiedCode] = useState(''); // Nuevo estado para el código modificado
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctLine, setCorrectLine] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [gameResult, setGameResult] = useState(null); // Resultado del juego 
  const [completedChallenges, setCompletedChallenges] = useState([]); // Estado para los ejercicios completados

  const { userId } = useParams(); // ID del usuario
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exerciseRes = await axios.get(`/exercises/codewars/${exerciseId}`);
        setExercise(exerciseRes.data);

        const exerciseDetailsRes = await axios.get(`/codewars/challenge/${exerciseId}`);
        setExerciseDetails(exerciseDetailsRes.data);

        const userRes = await axios.get(`/users/${userId}`);
        setUser(userRes.data);
        setCompletedChallenges(userRes.data.completedChallenges || []); // Obtener ejercicios completados

        setLoading(false);
      } catch (err) {
        setError('Error al obtener los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, userId]);

  useEffect(() => {
    const fetchIncorrectOptions = async () => {
      try {
        if (exercise && exercise.answer && exercise.answer.python) {
          const codeLines = exercise.answer.python.split('\n');
          const lineIndex = Math.floor(Math.random() * codeLines.length); // Escoger una línea aleatoria
          setCorrectLine(codeLines[lineIndex]);

          // Obtener líneas aleatorias de otros ejercicios
          const otherExercisesRes = await axios.get(`/exercises`);
          const otherExercises = otherExercisesRes.data.filter((ex) => ex.codewarsId !== exerciseId);

          const incorrectOptions = [];
          while (incorrectOptions.length < 3 && otherExercises.length > 0) {
            const randomExercise = otherExercises[Math.floor(Math.random() * otherExercises.length)];
            const lines = randomExercise.answer.python.split('\n');
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            if (!incorrectOptions.includes(randomLine) && randomLine !== codeLines[lineIndex]) {
              incorrectOptions.push(randomLine);
            }
          }

          // Crear opciones
          const allOptions = [codeLines[lineIndex], ...incorrectOptions];
          const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
          setOptions(shuffledOptions);

          // Modificar el código para que falte la línea correcta
          const modifiedLines = [...codeLines];
          modifiedLines[lineIndex] = '________';
          setModifiedCode(modifiedLines.join('\n')); // Guardar el código modificado
        }
      } catch (err) {
        console.error('Error al obtener las opciones incorrectas:', err);
      }
    };

    fetchIncorrectOptions();
  }, [exercise]);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    if (option === correctLine) {
      await handleGameCompletion(true);
    } else {
      await handleGameCompletion(false); // Esto asegura que los tags incorrectos se actualicen.
    }
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

  const restartGame = () => {
    setGameResult(null);
    setSelectedOption('');
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
    <div id="exercise-page">
      <div id="exercise-container" className="exercise-container">
        <div id="exercise-info" className="exercise-info">
          <h1>{exerciseDetails?.name}</h1>
          <p>
            <div
              id="exercise-description"
              dangerouslySetInnerHTML={{
                __html:
                  removeTripleBackticksContent(exerciseDetails?.description) ||
                  "No Description Available",
              }}
            />
          </p>
        </div>

        <div id="exercise-code" className="exercise-code">
          <h2>Python Code</h2>
          <pre id="code-content">{modifiedCode || "Cargando código..."}</pre>
        </div>

        <div id="options-container" className="options">
          {options.map((option, index) => (
            <button
              key={index}
              id={`option-${index}`}
              className={`option ${selectedOption === option ? "selected" : ""}`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {gameResult && (
          <div id="result-modal" className="result-modal">
            {gameResult === "win" ? (
              <>
                <p>Correct! You have completed the exercise.</p>
                <button
                  id="back-button"
                  onClick={() => navigate(`/user/${userId}/game/game2`)}
                >
                  Back to the list of exercises
                </button>
              </>
            ) : (
              <>
                <p>Incorrect! Please try again.</p>
                <button id="retry-button" onClick={restartGame}>
                  Retry
                </button>
                <button
                  id="back-button"
                  onClick={() => navigate(`/user/${userId}/game/game2`)}
                >
                  Back to the list of exercises
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>

  );
};

export default Game2Exercise;