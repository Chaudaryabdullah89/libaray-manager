import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-4 mt-10 left-0 z-50">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
      <div className="mb-2 md:mb-0">
        <span className="font-semibold">&copy; {new Date().getFullYear()} Book Library Manager</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline text-blue-300">Home</Link>
        {/* Social icons placeholder */}
        <h2 className='text-white'>Created By Abdullah..</h2>
      </div>
    </div>
  </footer>
);

export default Footer; 