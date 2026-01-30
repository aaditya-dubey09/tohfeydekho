import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-[75vh] flex items-center justify-center text-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <img
        src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=2000"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        alt="Hero"
      />
      <div className="relative z-10 max-w-5xl px-4 space-y-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
          GIFTING MADE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500">EFFORTLESS.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-semibold max-w-2xl mx-auto">
          Our rule-based engine finds the perfect product for any occasion in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            to="/quiz"
            className="px-8 md:px-10 py-4 md:py-5 bg-white text-black rounded-full font-black text-base md:text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg"
          >
            Find the Perfect Product <ArrowRight size={20} />
          </Link>
          <Link
            to="/browse"
            className="px-8 md:px-10 py-4 md:py-5 bg-transparent border-2 border-white text-white rounded-full font-black text-base md:text-lg hover:bg-white hover:text-black transition-all"
          >
            Browse All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
