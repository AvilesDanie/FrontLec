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
    <div className="form-container">
      <div className="col form-col-1">
        <div className="image-layer">
          <img src={whiteOutline} alt="Outline" className="form-image-main" />
          <img src={cohete} alt="Cohete" className="form-image cohete" />
        </div>
        <p className="featured-words">
          <br /> You are about to enter a page that will help you with your needs.
        </p>
      </div>
      <div className="col form-col-2">
        <div className="btn-box">
          <button
            className={`btn btn-1 ${isLogin ? "active" : ""}`}
            id="login"
            onClick={() => handleSwitchForm("login")}
          >
            Login
          </button>
          <button
            className={`btn btn-2 ${!isLogin ? "active" : ""}`}
            id="register"
            onClick={() => handleSwitchForm("register")}
          >
            Register
          </button>
        </div>

        <form
          className="login-form"
          style={{
            left: isLogin ? "50%" : "150%",
            opacity: isLogin ? 1 : 0,
          }}
          onSubmit={handleSubmit}
        >
          <div className="form-title">
            <span>Login</span>
          </div>
          <div className="form-inputs">
            <div className="input-box">
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <i className="bx bx-envelope icon"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <i className="bx bx-lock-alt icon"></i>
            </div>
            <div className="input-box">
              <button className="input-submit">
                <span>Login</span>
                <i className="bx bx-right-arrow-alt"></i>
              </button>
              {message && (
                <p className={`message ${messageType === "error" ? "error" : "success"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </form>

        <form
          className="register-form"
          style={{
            left: isLogin ? "-50%" : "50%",
            opacity: isLogin ? 0 : 1,
          }}
          onSubmit={handleSubmit}
        >
          <div className="form-title">
            <span>Create Account</span>
          </div>
          <div className="form-inputs">
            <div className="input-box">
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="User name"
                onChange={handleChange}
                required
              />
              <i className="bx bx-user icon"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <i className="bx bx-envelope icon"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <i className="bx bx-lock-alt icon"></i>
            </div>
            <div className="input-box">
              <button className="input-submit">
                <span>Register</span>
                <i className="bx bx-right-arrow-alt"></i>
              </button>
              {message && (
                <p className={`message ${messageType === "error" ? "error" : "success"}`}>
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