import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import HomePage from "./components/HomePage";
import ExerciseList from "./components/ExerciseList";
import Game1 from "./components/Game1";
import Game2 from "./components/Game2";
import Game3 from "./components/Game3";
import RankingPage from "./components/RankingPage";
import Info from "./components/User";
import Layout from "./components/Layout"; // Importa Layout
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Importa el JavaScript de Bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Página de Login sin Navbar */}
        <Route path="/" element={<LoginRegister />} />

        {/* Rutas con Navbar y Footer dentro del Layout */}
        <Route path="/user/:userId" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="game/:gameMode" element={<ExerciseList />} />
          <Route path="info" element={<Info />} />
          <Route path="game/game1/exercise/:exerciseId" element={<Game1 />} />
          <Route path="game/game2/exercise/:exerciseId" element={<Game2 />} />
          <Route path="game/game3/exercise/:exerciseId" element={<Game3 />} />
          <Route path="ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
