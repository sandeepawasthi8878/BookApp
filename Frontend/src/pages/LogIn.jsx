import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {authActions} from "../components/store/auth"
import {useDispatch} from "react-redux"
import axios from "axios";

const Login = () => {
  const [Values, setValues] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault(); // Prevents page refresh
    try {
      if (Values.username === "" || Values.password === "") {
        alert("Both fields are required");
      } else {
        const response = await axios.post("http://localhost:5000/api/v1/sign-in", Values);
      
      dispatch(authActions.login())
      dispatch(authActions.changeRole(response.data.role))
        localStorage.setItem("id",response.data.id)
       localStorage.setItem("token",response.data.token)
       localStorage.setItem("role",response.data.role)
       navigate("/profile")
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-zinc-200 mb-6">Login</h2>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-zinc-300 mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-zinc-700 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Enter your username"
              name="username"
              value={Values.username}
              onChange={change}
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-zinc-700 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Enter your password"
              name="password"
              value={Values.password}
              onChange={change}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-600 text-zinc-200 p-3 rounded-lg font-semibold hover:bg-zinc-500 transition"
          >
            Login
          </button>
        </form>

        <p className="text-zinc-400 text-center mt-6">
          Don't have an account? <a href="#" className="text-zinc-200 underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
