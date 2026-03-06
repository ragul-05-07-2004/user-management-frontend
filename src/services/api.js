import axios from "axios";

const API = axios.create({
  baseURL: "https://user-management-api-mace.onrender.com/api"
});

export default API;