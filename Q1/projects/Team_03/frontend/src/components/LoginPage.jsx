import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/userContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // using the context i created - 
  const {setUser} = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      // Login — backend sets the cookie
      await axios.post(
        `${import.meta.env.VITE_DB_LINK}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );

      // Fetch user profile
      const profileRes = await axios.get(
        `${import.meta.env.VITE_DB_LINK}/api/users/profile`,
        { withCredentials: true }
      );

      setUser(profileRes.data);
      console.log(profileRes.data); // debug
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 to-green-100 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-green-700 uppercase mb-2 tracking-wide">Login</h1>
        {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 transition">
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-green-600 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
