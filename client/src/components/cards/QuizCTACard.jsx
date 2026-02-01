import React from 'react';
import { Link } from 'react-router-dom';

const QuizCTACard = () => {
  return (
    <section className="bg-yellow-400 rounded-4xl px-8 md:px-16 py-12 md:py-16 text-center space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -mr-16 -mt-16 group-hover:scale-200 transition-transform duration-300" />
      <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black">STUCK? LET US HELP.</h2>
      <p className="text-base md:text-lg font-bold text-black max-w-2xl mx-auto">Don't waste time scrolling. Take our quick quiz and get perfect recommendations tailored just for you.</p>
      <Link
        to="/quiz"
        className="inline-block px-10 md:px-12 py-4 md:py-5 bg-black text-white rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform"
      >
        Start the Quiz
      </Link>
    </section>
  );
};

export default QuizCTACard;
