import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./register.css";
import registerImg from "../assets/register.png";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    image: null
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {

    let error = "";

    switch (name) {

      case "firstName":
      case "lastName":
        if (!value.match(/^[A-Za-z]+$/)) {
          error = "Only alphabets allowed";
        }
        break;

      case "email":
        if (!value.match(/^\S+@\S+\.\S+$/)) {
          error = "Invalid email format";
        }
        break;

      case "phone":
        if (!value.match(/^\d{10}$/)) {
          error = "Phone must be 10 digits";
        }
        break;

      case "password":
        if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;

      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: error
    });

  };


  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files) {

      setFormData({
        ...formData,
        image: files[0]
      });

    } else {

      setFormData({
        ...formData,
        [name]: value
      });

      validate(name, value);

    }

  };


 const isFormValid = () => {

  if (
    formData.firstName.trim() === "" ||
    formData.lastName.trim() === "" ||
    formData.email.trim() === "" ||
    formData.phone.trim() === "" ||
    formData.dob === "" ||
    formData.password.trim() === "" 
  ) {
    return false;
  }

  if (Object.values(errors).some((error) => error !== "")) {
    return false;
  }

  return true;
};


  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = new FormData();

    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("dob", formData.dob);
    data.append("password", formData.password);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {

      await API.post("/register", data);

      toast.success("Registration Successful!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {

      toast.error("Registration Failed");

    }

  };


  return (

    <div className="register-container">

      {/* LEFT SIDE ILLUSTRATION */}
      <div className="register-left">
        <img src={registerImg} alt="register illustration" />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="register-right">

        <div className="form-card">

          <h2>User Registration</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <p className="error">{errors.firstName}</p>

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <p className="error">{errors.lastName}</p>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <p className="error">{errors.email}</p>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <p className="error">{errors.phone}</p>

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <p className="error">{errors.password}</p>

            <label className="upload-btn">
            Upload Profile Image [Optional]
            <input
             type="file"
             name="image"
             accept="image/png, image/jpeg"
            onChange={handleChange}
             hidden
             />
          </label>

            <button type="submit" disabled={!isFormValid()}>
              Register
            </button>

          </form>

        </div>

      </div>

      <ToastContainer />

    </div>

  );

}

export default Register;