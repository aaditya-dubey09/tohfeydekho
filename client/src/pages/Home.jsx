import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/product.thunk';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import QuizCTACard from '../components/cards/QuizCTACard';
import ExpertCTACard from '../components/cards/ExpertCTACard';
import ProductCategorySection from '../components/sections/ProductCategorySection';
import TrendingProducts from '../components/sections/TrendingProducts';
import TrendingTags from '../components/sections/TrendingTags';
import ExpertTalkModal from '../components/ExpertTalkModal';

const Home = () => {
  const dispatch = useDispatch();
  const { list: products } = useSelector(state => state.products);
  const [showExpertModal, setShowExpertModal] = useState(false);

  useEffect(() => {
    console.log('Home: Fetching all products');
    dispatch(fetchAllProducts());
  }, [dispatch]);

  

  // Using actual backend category enum values
  const categories = ['electronics', 'home_decor', 'fashion', 'food_beverage'];

  return (
    <div className="space-y-20 pb-20">
      <HeroSection />

      <FeaturesSection />

      {/* Combined CTA Section - Quiz & Expert Consultation */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuizCTACard />
          <ExpertCTACard onBookClick={() => setShowExpertModal(true)} />
        </div>
      </section>

      {/* Trending Sections */}
      <TrendingProducts products={products} />
      <TrendingTags products={products} />

      {/* Top Products by Category */}
      {categories.map(category => (
        <ProductCategorySection 
          key={category} 
          category={category} 
          products={products}
        />
      ))}

      {/* Expert Talk Modal */}
      <ExpertTalkModal 
        isOpen={showExpertModal} 
        onClose={() => setShowExpertModal(false)}
        source="home"
      />
    </div>
  );
};

export default Home;
