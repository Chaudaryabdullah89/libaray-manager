import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css';
import axios from 'axios';
import axiosapiurl from './axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/Authcontext';
const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
 const backendapi = axiosapiurl
 const { authenticated, setAuthenticated, user,users } = useAuth();
 console.log(users)


  const handleLogout = (e) => {
    e.preventDefault();
    console.log('Logging out');
    axios.post(`${backendapi}/logout`,{ withCredentials :true})
    .then(res =>{
        console.log(res.data);
        setAuthenticated(false);
      
        toast.success('Logged out successfully');
    })
    .catch(err =>{
        console.log(err);
        toast.error('Failed to logout');
    })

  }
  return (
    <div>
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white">
        <div className="font-bold text-2xl">
          <Link to='/' >
          Library Manager
          </Link>
        </div>
        <ul className="flex gap-3 items-center list-none m-0 p-0">
          <li>
            <Link to="/add-book" className={` ${authenticated ? 'block' : 'hidden'} text-white no-underline hover:underline ${isActive('/add-book') ? 'text-green-400' : 'text-white'} transition-colors duration-200`}>
              Add Book
            </Link>
          </li>
          <li>
            <Link to={user && user._id ? `/admin/my-books/${user._id}` : `/admin/my-books/${user}`} className={` ${authenticated ? 'block' : 'hidden'} text-white no-underline hover:underline ${isActive('/my-books') ? 'text-green-400' : 'text-white'} transition-colors duration-200`}>
              My Books
            </Link>
          </li>
          <li>
            <Link to="/login" className={`text-white ${authenticated ? 'hidden' : 'block'} no-underline hover:underline ${isActive('/login') ? 'text-green-400' : 'text-white'} transition-colors duration-200`}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className={`text-white ${authenticated ? 'hidden' : 'block'} no-underline hover:underline ${isActive('/register') ? 'text-green-400' : 'text-white'} transition-colors duration-200`}>
              Register
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={`cursor-pointer text-white ${authenticated ? 'block' : 'hidden'} no-underline hover:underline ${isActive('/logout') ? 'text-green-400' : 'text-white'} transition-colors duration-200`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar