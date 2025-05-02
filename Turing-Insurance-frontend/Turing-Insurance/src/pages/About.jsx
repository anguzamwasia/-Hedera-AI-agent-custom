import React from 'react';

const About = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-16 flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1521790945508-bf2a36314e85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-xl p-10 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-[#0052CC] text-center mb-6">About Our Platform</h1>
        <p className="text-lg text-gray-800 mb-6">
          Welcome to <span className="font-semibold text-[#0052CC]">Turing Insurance</span> — your trusted partner in simplifying insurance claims. 
          We are committed to empowering policyholders by providing a seamless, transparent, and user-friendly digital claims experience.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          We believe insurance should be about trust and ease. Our mission is to remove the complexities often associated with the claims process.
          Through this platform, we aim to reduce stress, save time, and help you focus on what truly matters — recovery and peace of mind.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Who We Are</h2>
        <p className="text-gray-700 mb-6">
          We are a team of developers, designers, and insurance experts united by a single goal — to modernize the insurance experience. 
          With backgrounds in finance, tech, and customer service, our diverse team ensures that the platform remains intuitive, secure, and efficient.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Easy-to-use claim submission and tracking interface</li>
          <li>Real-time updates and communication with insurers</li>
          <li>Secure document uploads and digital claim history</li>
          <li>Dedicated admin dashboard for managing claims efficiently</li>
        </ul>

        <div className="mt-10 text-center">
          <p className="text-lg font-medium text-gray-900">
            Thank you for choosing <span className="text-[#0052CC]">Turing Insurance</span>. We’re here to make insurance simple again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
