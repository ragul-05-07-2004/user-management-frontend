import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./login.css";
import loginImg from "../assets/login.png";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = (name, value) => {

    let error = "";

    if (name === "email") {
      if (!value.match(/^\S+@\S+\.\S+$/)) {
        error = "Invalid email format";
      }
    }

    setErrors({
      ...errors,
      [name]: error
    });

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    validate(name, value);
    setMessage("");

  };

  const isFormValid = () => {

    return (
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      !errors.email
    );

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post("/login", formData);

      setMessage(response.data.message);

      navigate("/profile", { state: { email: formData.email } });

    } catch (error) {

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Server error");
      }

    }

  };

  return (

    <div className="login-container">

      {/* Illustration */}

      <div className="login-left">
        <img src={loginImg} alt="login illustration"/>
      </div>


      {/* Login Form */}

      <div className="login-right">

        <div className="login-card">

          <h2>Login</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <p className="error">{errors.email}</p>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={!isFormValid()}
            >
              Login
            </button>

          </form>

          {message && (
            <p className={message.includes("success") ? "success" : "error"}>
              {message}
            </p>
          )}

          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

        </div>

      </div>

    </div>

  );

}

export default Login;