// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',        // Navy Blue
        accent: '#2563EB',         // Action Blue
        background: '#F1F5F9',     // Soft Gray
        textDark: '#334155',       // Dark Slate
        success: '#10B981',        // Green
        warning: '#FACC15',        // Yellow
      },
    },
  },
  plugins: [],
};
