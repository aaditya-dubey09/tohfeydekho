import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { productsAPI } from '../services/api';
import { addToCart } from '../redux/slices/cartSlice';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productsAPI.getAll();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const getDisplayPrice = (product) => {
    if (!product.retailer_prices || product.retailer_prices.length === 0) return null;
    const prices = product.retailer_prices.map(rp => rp.price);
    return Math.min(...prices);
  };

  const getTopProductsByCategory = (category, limit = 3) => {
    return products
      .filter(p => p.category === category)
      .sort((a, b) => (b.expert_rating || 0) - (a.expert_rating || 0))
      .slice(0, limit);
  };

  const categories = ['Tech', 'Home & Living', 'Fashion', 'Food & Beverage'];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
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

      {/* Features Section */}
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

      {/* CTA Section */}
      <section className="bg-yellow-400 rounded-4xl px-8 md:px-16 py-12 md:py-16 text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black">STUCK? LET US HELP.</h2>
        <p className="text-base md:text-lg font-bold text-black max-w-2xl mx-auto">Don't waste time scrolling. Take our quick quiz and get 9 perfect recommendations tailored just for you.</p>
        <Link
          to="/quiz"
          className="inline-block px-10 md:px-12 py-4 md:py-5 bg-black text-white rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform"
        >
          Start the Quiz
        </Link>
      </section>

      {/* Top Products by Category */}
      {categories.map(category => {
        const topProducts = getTopProductsByCategory(category);
        if (topProducts.length === 0) return null;

        return (
          <section key={category} className="space-y-6 border-b-4 border-black pb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{category.toUpperCase()}</h2>
                <p className="text-gray-600 font-bold mt-2">Expertly curated picks you'll love</p>
              </div>
              <Link
                to="/browse"
                state={{ category }}
                className="px-6 py-3 bg-black text-white rounded-full font-black hover:shadow-[4px_4px_0px_gray] transition-all flex items-center gap-2"
              >
                View All <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topProducts.map(product => (
                <div
                  key={product._id}
                  className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-black hover:shadow-[8px_8px_0px_black] transition-all duration-300"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {product.expert_rating && product.expert_rating >= 4 && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black">
                          ⭐ {product.expert_rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5 space-y-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-lg font-black hover:underline line-clamp-2">{product.name}</h3>
                    </Link>

                    <div className="flex flex-wrap gap-2">
                      {product.occasion_tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {getDisplayPrice(product) && (
                      <div className="text-2xl font-black text-black">
                        ₹{getDisplayPrice(product).toLocaleString()}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} /> Cart
                      </button>
                      <Link
                        to={`/product/${product._id}`}
                        className="px-4 py-3 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Home;
