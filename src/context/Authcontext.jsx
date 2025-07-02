import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosapiurl from '../Components/axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null); // Add users state

  useEffect(() => {
    axios.get(`${axiosapiurl}/check-auth`, { withCredentials: true })
      .then((res) => {
        // console.log(res.data);
        setAuthenticated(true);
        setUsers(res.data.user); // set the user object
        setUser(res.data.userId); 
    
       
        console.log('users ID:', res.data.userId);
      })
      .catch((err) => {
        console.log(err);
        setAuthenticated(false);
        setUsers(null);
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, user, users, setUser, setUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
