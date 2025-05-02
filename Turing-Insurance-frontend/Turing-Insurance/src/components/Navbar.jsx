import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="text-xl font-bold text-blue-800">Turing Insurance</div>

      {/* Hamburger Button */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Links */}
      <div className={`flex-col md:flex md:flex-row md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ease-in-out ${isOpen ? 'flex' : 'hidden'}`}>
        <Link to="/" className="px-4 py-2 text-gray-700 hover:text-blue-700">Home</Link>
        <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-700">Login</Link>
        <Link to="/track-claim" className="px-4 py-2 text-gray-700 hover:text-blue-700">Track Claim</Link>
        <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:text-blue-700">Dashboard</Link>
        <Link to="/claim/123" className="px-4 py-2 text-gray-700 hover:text-blue-700">Claim Details</Link>
        <Link to="/claim-form" className="px-4 py-2 text-gray-700 hover:text-blue-700">Claim Form</Link>
        <Link to="/about" className="px-4 py-2 text-gray-700 hover:text-blue-700">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
