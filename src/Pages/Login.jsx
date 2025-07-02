import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosapiurl from '../Components/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/Authcontext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
const [error, setError] = useState('');
  const { setUser, setAuthenticated } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the values
    console.log({ email, password });
    axios.post(`${axiosapiurl}/login`, { email, password }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (response.data.message === 'User logged in successfully') {
          setUser(response.data.user);
          setAuthenticated(true);
          navigate('/');
          toast.success('Login successful');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setError(error.message);
        toast.error('Login failed');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-2 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800 flex items-center justify-center gap-2">
          <FaSignInAlt className="text-green-500" /> Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope /></span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaLock /></span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                placeholder="Enter your password"
              />
            </div>
          </div>
          {error && <div className="text-center text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaSignInAlt /> Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 