import React from 'react';
import ReactGA from 'react-ga4';

const ExpertCTACard = ({ onBookClick }) => {
  const handleClick = () => {
    ReactGA.event('select_content', {
      content_type: 'expert_consultation',
      item_id: 'expert_talk_29',
      source: 'cta_card'
    });
    onBookClick();
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-4xl px-8 md:px-10 py-12 md:py-16 text-center space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-200 transition-transform duration-300" />
      <div className="relative z-10 space-y-4">
        <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          Book Now
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-2">Expert Talk</h2>
          <p className="text-gray-300 font-semibold">1:1 personalized consultation</p>
        </div>
        <div className="text-yellow-400 text-3xl font-black">₹29</div>
        <button
          onClick={handleClick}
          className="inline-block px-10 py-4 bg-yellow-400 text-black rounded-full font-black text-lg hover:bg-yellow-300 transition-all"
        >
          Book Now →
        </button>
      </div>
    </div>
  );
};

export default ExpertCTACard;
