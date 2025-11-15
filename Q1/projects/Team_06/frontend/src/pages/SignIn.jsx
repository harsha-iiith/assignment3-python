import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../reducers/user";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", { email, password });
      const data = response.data;
      console.log(data);
      dispatch(setUserDetails(data));
      console.log(user);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center bg-indigo-600 text-white font-semibold py-2 rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
