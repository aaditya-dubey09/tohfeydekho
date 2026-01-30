import React from 'react';
import { Zap, Sparkles, ShieldCheck } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-4 p-8 bg-white border-gray-100 rounded-2xl transition-all hover:shadow-[8px_8px_0px_black]">
        <div className="w-12 h-12 bg-[#030608] text-white rounded-xl flex items-center justify-center">
          <Zap size={24} />
        </div>
        <h3 className="text-2xl font-black">Instant Matching</h3>
        <p className="text-gray-600 font-medium">Our proprietary algorithm analyzes relation, occasion, and personality to find the best match.</p>
      </div>
      <div className="space-y-4 p-8 bg-white border-gray-100 rounded-2xl transition-all hover:shadow-[8px_8px_0px_black]">
        <div className="w-12 h-12 bg-[#030608] text-white rounded-xl flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <h3 className="text-2xl font-black">Expert Curated</h3>
        <p className="text-gray-600 font-medium">Every product is hand-picked and rated by our gifting experts for quality and "wow" factor.</p>
      </div>
      <div className="space-y-4 p-8 bg-white border-gray-100 rounded-2xl transition-all hover:shadow-[8px_8px_0px_black]">
        <div className="w-12 h-12 bg-[#030608] text-white rounded-xl flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <h3 className="text-2xl font-black">Best Prices</h3>
        <p className="text-gray-600 font-medium">We compare prices across Amazon, Flipkart, and local sellers to ensure you get the best deal.</p>
      </div>
    </section>
  );
};

export default FeaturesSection;
