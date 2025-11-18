import React, { useState, useEffect } from 'react';

export default function Home({ user, onLogout }) {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Selamat datang di aplikasi kami! Nikmati pengalaman yang luar biasa.';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Home</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all"
          >
            <span className="text-xl">🚪</span>
            Logout
          </button>
        </div>
        
        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👤</span>
            <h2 className="text-xl font-semibold text-white">
              Halo, 
            </h2>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl p-8 min-h-[200px] flex items-center justify-center border border-white/20">
          <p className="text-2xl text-white font-medium text-center leading-relaxed">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-3 mx-auto"></div>
              <p className="text-white text-center text-sm font-medium">Feature {i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}