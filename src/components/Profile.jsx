import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import defaultProfile from "../assets/default-profile.png";
import profileImg from "../assets/profile-illustration.png";
import "./profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("email");

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    image: null
  });



  useEffect(() => {

    if (!email) {
      navigate("/");
      return;
    }

  }, [email, navigate]);



  useEffect(() => {

    const fetchUser = async () => {

      try {

        const response = await API.get(`/profile/${email}`);

        setUser(response.data);

        setFormData({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          phone: response.data.phone,
          dob: response.data.dob,
          image: null
        });

      } catch (error) {
        console.log(error);
      }

    };

    if (email) fetchUser();

  }, [email]);


  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files) {

      const file = files[0];

      setFormData({
        ...formData,
        image: file
      });

      setPreview(URL.createObjectURL(file));

    } else {

      setFormData({
        ...formData,
        [name]: value
      });

    }

  };

      

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      await API.put(`/profile/${user.id}`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        dob: formData.dob
      });

      if (formData.image) {

        const imageData = new FormData();
        imageData.append("image", formData.image);

        await API.put(`/profile/${user.id}/image`, imageData);

      }

      toast.success("Profile Updated Successfully ");

      const response = await API.get(`/profile/${email}`);

      setUser(response.data);
      setEditMode(false);
      setPreview(null);

    } catch (error) {

      console.log(error);

    }

  };


  const logout = () => {

    localStorage.removeItem("email");
    navigate("/");

  };


  if (!user) {

    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    );

  }


  return (

    <div className="profile-container">

      {/* Illustration */}
      
         <ToastContainer position="top-right" autoClose={2000} />
      <div className="profile-left">
        <img src={profileImg} alt="profile illustration"/>
      </div>


      {/* Profile Card */}

      <div className="profile-right">

        <div className="profile-card">

          <h2>My Profile</h2>

          <img
            className="profile-avatar"
            src={
              preview
                ? preview
                : user.image
                ? `data:image/jpeg;base64,${user.image}`
                : defaultProfile
            }
            alt="profile"
          />


          {editMode ? (

            <form onSubmit={handleUpdate}>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

              <label className="upload-btn">
                Upload Profile Image
              <input
               type="file"
               name="image"
              accept="image/png, image/jpeg"
              onChange={handleChange}
               hidden
                />
              </label>

              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>

            </form>

          ) : (

            <div className="profile-info">

            <p><b>First Name:</b> {user.first_name}</p>
            <p><b>Last Name:</b> {user.last_name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phone}</p>
            <p><b>DOB:</b> {new Date(user.dob).toLocaleDateString()}</p>
            <p>
            <b>Account Created:</b>{" "}
            {new Date(user.created_at).toLocaleString()}
            </p>
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
         <button onClick={logout}>Logout</button>
        
        </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default Profile;