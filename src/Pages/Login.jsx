import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosapiurl from '../Components/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/Authcontext';
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
   
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f3f4f6"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: 32
      }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 24,
          textAlign: "center",
          color: "#1f2937"
        }}>Login</h2>
        <form onSubmit={handleSubmit}>
         
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email" style={{
              display: "block",
              color: "#374151",
              fontWeight: 500,
              marginBottom: 8
            }}>Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                outline: "none",
                fontSize: 16
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="password" style={{
              display: "block",
              color: "#374151",
              fontWeight: 500,
              marginBottom: 8
            }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                outline: "none",
                fontSize: 16
              }}
            />
          </div>
          <button type="submit" style={{
            width: "100%",
            background: "#16a34a",
            color: "#fff",
            padding: "10px 0",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseOver={e => e.currentTarget.style.background = "#15803d"}
          onMouseOut={e => e.currentTarget.style.background = "#16a34a"}
          >Login</button>
          <span className='text-center mt-4' style={{ color: "red" }}>{error}</span>
        </form>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <span style={{ color: "#6b7280" }}>Don't have an account? </span>
          <Link to="/register" style={{ color: "#2563eb", textDecoration: "underline" }}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 