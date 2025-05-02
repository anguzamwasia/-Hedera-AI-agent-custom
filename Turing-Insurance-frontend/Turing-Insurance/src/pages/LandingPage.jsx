import React from 'react';
import { Link } from 'react-router-dom';
import pic1 from '../assets/pic1.jpg'; 
const LandingPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${pic1})` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen flex flex-col justify-center items-center text-white text-center px-4 py-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight">
          File Your Insurance Claim Securely
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 max-w-md sm:max-w-xl">
          Our automated claims platform makes filing, tracking, and processing insurance claims faster and more transparent.
        </p>
        <Link to="/register">
          <button className="bg-[#00B8D9] hover:bg-[#0096b3] text-white font-semibold px-6 py-3 rounded-lg transition">
            Get Started
          </button>
        </Link>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left max-w-6xl w-full px-4">
          {[
            {
              title: "Fast Photo Uploads",
              desc: "Quickly upload images of your vehicle, dashboard videos and documents.",
            },
            {
              title: "Transparent Tracking",
              desc: "Track your claim every step of the way.",
            },
            {
              title: "Blockchain Secure",
              desc: "Funds are disbursed securely with blockchain transparency.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-20 backdrop-blur-sm p-6 rounded-xl shadow text-white"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#00B8D9] mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
