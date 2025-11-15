import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // API call to register
      const res = await axios.post(
        `${import.meta.env.VITE_DB_LINK}/api/users/register`,
        { username: name, email, password },
        { withCredentials: true }
      );

      console.log(res.data);

      // SUCCESS: Navigate to the login page
      navigate("/login");

    } catch (err) {
      // Handles error (e.g., email already taken)
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 to-green-100 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-green-700 uppercase mb-2 tracking-wide">Sign Up</h1>
        {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            className="mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 transition">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-semibold hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
