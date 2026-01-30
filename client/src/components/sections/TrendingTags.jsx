import React from 'react';
import { Link } from 'react-router-dom';
import { Hash, TrendingUp } from 'lucide-react';

const TrendingTags = ({ products }) => {
  const getTrendingTags = (limit = 20) => {
    // Count tag occurrences from trending products with tag type tracking
    const tagInfo = {};
    
    products
      .filter(p => p.is_visible)
      .sort((a, b) => {
        const scoreA = (a.wishlist_count || 0) * 3 + (a.cart_count || 0) * 2 + (a.views || 0) * 0.1;
        const scoreB = (b.wishlist_count || 0) * 3 + (b.cart_count || 0) * 2 + (b.views || 0) * 0.1;
        return scoreB - scoreA;
      })
      .slice(0, 30) // Top 30 products
      .forEach(product => {
        // Track tags by type
        (product.occasion_tags || []).forEach(tag => {
          if (!tagInfo[tag]) tagInfo[tag] = { count: 0, type: 'occasion' };
          tagInfo[tag].count++;
        });
        (product.emotion_tags || []).forEach(tag => {
          if (!tagInfo[tag]) tagInfo[tag] = { count: 0, type: 'emotion' };
          tagInfo[tag].count++;
        });
        (product.personality_tags || []).forEach(tag => {
          if (!tagInfo[tag]) tagInfo[tag] = { count: 0, type: 'personality' };
          tagInfo[tag].count++;
        });
      });

    // Convert to array and sort by count
    return Object.entries(tagInfo)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([tag, info]) => ({ tag, type: info.type }));
  };

  const trendingTags = getTrendingTags();
  if (trendingTags.length === 0) return null;

  // Tag color variations
  const tagColors = [
    'bg-gradient-to-r from-purple-400 to-pink-400',
    'bg-gradient-to-r from-blue-400 to-cyan-400',
    'bg-gradient-to-r from-yellow-400 to-orange-400',
    'bg-gradient-to-r from-green-400 to-emerald-400',
    'bg-gradient-to-r from-red-400 to-rose-400',
    'bg-gradient-to-r from-indigo-400 to-purple-400'
  ];

  return (
    <section className="space-y-6 border-b-4 border-black pb-12">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl">
          <Hash size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">TRENDING TAGS</h2>
          <p className="text-gray-600 font-bold mt-1">Popular gift themes & occasions</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl">
        <div className="flex flex-wrap gap-3 justify-center">
          {trendingTags.map(({ tag, type }, index) => {
            // Create filter state based on tag type
            const filterState = {
              [type]: tag
            };
            
            return (
              <Link
                key={`${tag}-${type}`}
                to="/browse"
                state={{ filters: filterState }}
                className={`group relative px-6 py-3 ${tagColors[index % tagColors.length]} text-white rounded-full font-black text-sm hover:scale-110 hover:shadow-lg transition-all duration-300 flex items-center gap-2`}
              >
                <Hash size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="uppercase tracking-wide">{tag}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/browse"
          className="inline-block px-8 py-4 bg-black text-white rounded-full font-black hover:shadow-[6px_6px_0px_gray] transition-all"
        >
          Explore All Filters →
        </Link>
      </div>
    </section>
  );
};

export default TrendingTags;
