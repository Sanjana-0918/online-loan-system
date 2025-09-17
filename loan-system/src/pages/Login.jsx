import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No user found. Please signup first.");
      return;
    }

    if (storedUser.username === username && storedUser.password === password) {
      dispatch(login({ username }));
      navigate("/dashboard");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-80 space-y-4"
      >
        <h2 className="text-white text-xl font-semibold text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-indigo-600 p-2 rounded text-white">
          Login
        </button>
        <p className="text-gray-400 text-sm text-center">
          New user?{" "}
          <Link to="/signup" className="text-indigo-400">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
