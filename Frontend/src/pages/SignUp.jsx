
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault(); // Prevents page refresh
    try {
      if (
        Values.username === "" ||
        Values.email === "" ||
        Values.password === "" ||
        Values.address === ""
      ) {
        alert("All fields are required");
      } else {
        const response = await axios.post("http://localhost:5000/api/v1/sign-up", Values);
       alert(response.data.message); // Check the response in the console
        navigate("/Login"); // Redirect to login page on successful sign-up
      }
    } catch (error) {
     alert(error.response.data.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-zinc-200 mb-6">Sign Up</h2>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-zinc-300 mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-zinc-700 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Enter your username"
              name="username"
              required
              value={Values.username}
              onChange={change}
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-zinc-700 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Enter your email"
              name="email"
              required
              value={Values.email}
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
              required
              value={Values.password}
              onChange={change}
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-2">Address</label>
            <input
              type="text"
              className="w-full p-3 bg-zinc-700 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Enter your address"
              name="address"
              required
              value={Values.address}
              onChange={change}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-600 text-zinc-200 p-3 rounded-lg font-semibold hover:bg-zinc-500 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-zinc-400 text-center mt-6">
          Already have an account?{" "}
          <a href="#" className="text-zinc-200 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;







