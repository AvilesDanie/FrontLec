import React, { useState,useEffect  } from "react";
import axios from "../services/axiosConfig";
import "../css/LoginRegister.css";
import whiteOutline from "../img/white-outline.png";
import cohete from "../img/cohete.png";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" o "success"
  const navigate = useNavigate();

  const handleChange = (e) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Inicio de sesión
        console.log(1);
        const res = await axios.post("/users/login", {
            email: formData.email,
            password: formData.password,
        });
        console.log(2);
        
        // Muestra el mensaje de éxito en la página
        setMessage("Inicio de sesión exitoso");
        console.log(3);

        setMessageType("success");
        localStorage.setItem("token", res.data.token); // Guarda el token

        navigate(`/user/${res.data.userId}`);
      } else {
        // Registro
        console.log(formData);
        const res = await axios.post("/users", {
            username: formData.username,
            email: formData.email,
            password: formData.password, // Verifica que esta propiedad no esté vacía
            level: 1,
            experiencePoints: 1000,
            progress: 0
        });
        // Muestra el mensaje de éxito en la página
        setMessage(res.data.message);
        setMessageType("success");
      }
    } catch (err) {
        // Manejo de errores
        const errorMessage = err.response?.data?.message || "Error desconocido";
        setMessage(errorMessage);
        setMessageType("error");
    }
  };

  const handleSwitchForm = (formType) => {
    setIsLogin(formType === "login");
    setMessage(""); // Limpiar el mensaje
    setMessageType(""); // Limpiar el tipo de mensaje
  };

  // Lógica para los botones de login y registro
  useEffect(() => {
    const loginBtn = document.querySelector("#login");
    const registerBtn = document.querySelector("#register");
    const loginForm = document.querySelector(".login-form");
    const registerForm = document.querySelector(".register-form");

    loginBtn.addEventListener('click', () => {
      loginBtn.style.backgroundColor = "#21264D";
      registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

      loginForm.style.left = "50%";
      registerForm.style.left = "-50%";

      loginForm.style.opacity = 1;
      registerForm.style.opacity = 0;

      document.querySelector(".form-col-1").style.borderRadius = "0 30% 20% 0";
    });

    registerBtn.addEventListener('click', () => {
      loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      registerBtn.style.backgroundColor = "#21264D";

      loginForm.style.left = "150%";
      registerForm.style.left = "50%";

      loginForm.style.opacity = 0;
      registerForm.style.opacity = 1;

      document.querySelector(".form-col-1").style.borderRadius = "0 20% 30% 0";
    });

    // Cleanup event listeners when the component is unmounted
    return () => {
      loginBtn.removeEventListener('click', () => {});
      registerBtn.removeEventListener('click', () => {});
    };
  }, []);

  return (
    <div id="form-container" className="form-container">
      <div id="form-col-1" className="col form-col-1">
        <div id="image-layer" className="image-layer">
          <img id="outline-image" src={whiteOutline} alt="Outline" className="form-image-main" />
          <img id="rocket-image" src={cohete} alt="Cohete" className="form-image cohete" />
        </div>
        <p id="featured-words" className="featured-words">
          <br /> You are about to enter a page that will help you with your needs.
        </p>
      </div>

      <div id="form-col-2" className="col form-col-2">
        <div id="btn-box" className="btn-box">
          <button
            id="login-btn"
            className={`btn1 btn-1 ${isLogin ? "active" : ""} text-white`}
            onClick={() => handleSwitchForm("login")}
          >
            Login
          </button>
          <button
            id="register-btn"
            className={`btn1 btn-2 ${!isLogin ? "active" : ""} text-white`}
            onClick={() => handleSwitchForm("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        <form
          id="login-form"
          className="login-form"
          style={{
            left: isLogin ? "50%" : "150%",
            opacity: isLogin ? 1 : 0,
          }}
          onSubmit={handleSubmit}
        >
          <div id="login-form-title" className="form-title">
            <span>Login</span>
          </div>
          <div id="login-form-inputs" className="form-inputs">
            <div id="login-email-box" className="input-box">
              <input
                id="login-email"
                type="email"
                name="email"
                className="input-field"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <i className="bx bx-envelope icon"></i>
            </div>
            <div id="login-password-box" className="input-box">
              <input
                id="login-password"
                type="password"
                name="password"
                className="input-field"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <i className="bx bx-lock-alt icon"></i>
            </div>
            <div id="login-submit-box" className="input-box">
              <button id="login-submit" className="input-submit">
                <span>Login</span>
                <i className="bx bx-right-arrow-alt"></i>
              </button>
              {message && (
                <p id="login-message" className={`message ${messageType === "error" ? "error" : "success"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Register Form */}
        <form
          id="register-form"
          className="register-form"
          style={{
            left: isLogin ? "-50%" : "50%",
            opacity: isLogin ? 0 : 1,
          }}
          onSubmit={handleSubmit}
        >
          <div id="register-form-title" className="form-title">
            <span>Create Account</span>
          </div>
          <div id="register-form-inputs" className="form-inputs">
            <div id="register-username-box" className="input-box">
              <input
                id="register-username"
                type="text"
                name="username"
                className="input-field"
                placeholder="User name"
                onChange={handleChange}
                required
              />
              <i className="bx bx-user icon"></i>
            </div>
            <div id="register-email-box" className="input-box">
              <input
                id="register-email"
                type="email"
                name="email"
                className="input-field"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <i className="bx bx-envelope icon"></i>
            </div>
            <div id="register-password-box" className="input-box">
              <input
                id="register-password"
                type="password"
                name="password"
                className="input-field"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <i className="bx bx-lock-alt icon"></i>
            </div>
            <div id="register-submit-box" className="input-box">
              <button id="register-submit" className="input-submit">
                <span>Register</span>
                <i className="bx bx-right-arrow-alt"></i>
              </button>
              {message && (
                <p id="register-message" className={`message ${messageType === "error" ? "error" : "success"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>

  );
};

export default LoginRegister;