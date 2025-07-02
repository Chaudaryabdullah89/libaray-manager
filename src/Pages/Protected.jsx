import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosapiurl from '../Components/axios';
const Protected = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Checking authentication');
    axios.get(`${axiosapiurl}/check-auth`, { withCredentials: true })
      .then(res => {
        console.log(res.data);
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(err => {
        console.log(err.message);
        setAuthenticated(false);
        setLoading(false);
        navigate('/login');
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default Protected;
