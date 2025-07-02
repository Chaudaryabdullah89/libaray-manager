import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-6 mt-10 left-0 z-50 w-full">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
      <div className="mb-2 md:mb-0 text-center md:text-left">
        <span className="font-semibold">&copy; {new Date().getFullYear()} Book Library Manager</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline text-blue-300">Home</Link>
        <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub"><FaGithub size={20} /></a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><FaTwitter size={20} /></a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
        <span className='text-white text-xs sm:text-base ml-2'>Created By Abdullah..</span>
      </div>
    </div>
  </footer>
);

export default Footer; 