import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Star, ShoppingCart, Heart, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { productsAPI } from '../services/api';
import { addToCart } from '../redux/slices/cartSlice';

const Browse = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [allTags, setAllTags] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({
        category: [],
        budget_range: [],
        relation: [],
        occasion: [],
        emotion: [],
        personality: []
    });
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    // Filter options - only category and budget
    const filterOptions = {
        category: ['Tech', 'Home & Living', 'Fashion', 'Food & Beverage', 'Books & Media', 'Sports & Outdoors', 'Personalized', 'Experience'],
        budget_range: ['low', 'medium', 'high']
    };

    const TAG_LIMIT = 20; // Limit tags to show

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Handle navigation state filters
        if (location.state?.category) {
            setSelectedFilters(prev => ({
                ...prev,
                category: [location.state.category]
            }));
        }
        if (location.state?.searchQuery) {
            setSearchQuery(location.state.searchQuery);
        }
    }, [location.state]);

    useEffect(() => {
        applyFilters();
    }, [products, searchQuery, selectedFilters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await productsAPI.getAll();
            const productList = data.data || [];
            setProducts(productList);

            // Extract unique tags from products
            const tagMap = {
                relation: new Set(),
                occasion: new Set(),
                emotion: new Set(),
                personality: new Set()
            };

            productList.forEach(product => {
                if (product.relation_tags) product.relation_tags.forEach(tag => tagMap.relation.add(tag));
                if (product.occasion_tags) product.occasion_tags.forEach(tag => tagMap.occasion.add(tag));
                if (product.emotion_tags) product.emotion_tags.forEach(tag => tagMap.emotion.add(tag));
                if (product.personality_tags) product.personality_tags.forEach(tag => tagMap.personality.add(tag));
            });

            // Convert to arrays and shuffle to get random tags, then limit
            const tagsObj = {};
            Object.keys(tagMap).forEach(key => {
                const shuffled = Array.from(tagMap[key]).sort(() => Math.random() - 0.5);
                tagsObj[key] = shuffled.slice(0, TAG_LIMIT);
            });

            setAllTags(tagsObj);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedFilters.category.length > 0) {
            filtered = filtered.filter(product =>
                selectedFilters.category.includes(product.category)
            );
        }

        // Budget filter
        if (selectedFilters.budget_range.length > 0) {
            filtered = filtered.filter(product =>
                selectedFilters.budget_range.includes(product.budget_range)
            );
        }

        // Tag filters
        ['relation', 'occasion', 'emotion', 'personality'].forEach(tagType => {
            if (selectedFilters[tagType].length > 0) {
                filtered = filtered.filter(product => {
                    const productTags = product[`${tagType}_tags`] || [];
                    return selectedFilters[tagType].some(tag => productTags.includes(tag));
                });
            }
        });

        setFilteredProducts(filtered);
    };

    const toggleFilter = (filterType, value) => {
        setSelectedFilters(prev => {
            const current = prev[filterType];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [filterType]: updated };
        });
    };

    const clearFilters = () => {
        setSelectedFilters({
            category: [],
            budget_range: [],
            relation: [],
            occasion: [],
            emotion: [],
            personality: []
        });
        setSearchQuery('');
    };

    const hasActiveFilters = () => {
        return Object.values(selectedFilters).some(arr => arr.length > 0) || searchQuery;
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const getDisplayPrice = (product) => {
        if (!product.retailer_prices || product.retailer_prices.length === 0) return null;
        const prices = product.retailer_prices.map(rp => rp.price);
        return Math.min(...prices);
    };

    const groupByCategory = () => {
        const grouped = {};
        filteredProducts.forEach(product => {
            const category = product.category || 'Other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(product);
        });
        return grouped;
    };

    const groupedProducts = groupByCategory();
    const categories = Object.keys(groupedProducts).sort();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xl font-bold">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                    FIND THE BEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">GIFTS</span>
                </h1>
                <p className="text-xl text-gray-600">Explore our curated collection of perfect gifts</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name, category, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full text-lg focus:outline-none focus:border-black transition-colors"
                    />
                </div>
            </div>

            {/* Filter Tags */}
            <div className="bg-gray-50 p-6 rounded-3xl">
                <div className="flex flex-wrap gap-2 justify-center">
                    {/* 1. Static Filter Options (Category, Budget) */}
                    {Object.entries(filterOptions).map(([filterType, options]) =>
                        options.map(option => (
                            <button
                                key={option}
                                onClick={() => toggleFilter(filterType, option)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedFilters[filterType].includes(option)
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border-2 border-gray-200 hover:border-black'
                                    }`}
                            >
                                {option}
                            </button>
                        ))
                    )}

                    {/* 2. Dynamic Tags from Backend */}
                    {Object.entries(allTags).map(([tagType, tags]) =>
                        tags.map((tag, idx) => (
                            <button
                                key={`${tagType}-${idx}`}
                                onClick={() => toggleFilter(tagType, tag)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedFilters[tagType].includes(tag)
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border-2 border-gray-200 hover:border-black'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))
                    )}
                </div>

                {/* 3. Clear Filters Button (Centered below the wrapping line) */}
                {hasActiveFilters() && (
                    <div className="flex justify-center pt-6">
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <X size={16} /> clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Results Count */}
            {hasActiveFilters() && (
            <div className="text-center">
                <p className="text-lg font-bold">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                </p>
            </div>)}
            {/* Products by Category */}
            {categories.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <p className="text-2xl font-bold">No products found</p>
                    <p className="text-gray-600">Try adjusting your filters or search query</p>
                </div>
            ) : (
                categories.map(category => (
                    <section key={category} className="space-y-6">
                        <div className="border-b-4 border-black pb-2">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{category}</h2>
                            <p className="text-gray-600 font-medium">{groupedProducts[category].length} {groupedProducts[category].length === 1 ? 'item' : 'items'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {groupedProducts[category].map(product => (
                                <div
                                    key={product._id}
                                    className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-[10px_10px_0px_black] transition-shadow duration-300"
                                >
                                    <Link to={`/product/${product._id}`}>
                                        <div className="aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </Link>

                                    <div className="p-6 space-y-4">
                                        <Link to={`/product/${product._id}`}>
                                            <h3 className="text-xl font-bold hover:underline line-clamp-2">{product.name}</h3>
                                        </Link>

                                        {/* <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < Math.floor(product.expert_rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">
                                                {product.expert_rating?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div> */}

                                        <div className="flex flex-wrap gap-2">
                                            {product.occasion_tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold">
                                                    {tag}
                                                </span>
                                            ))}
                                            {product.emotion_tags?.slice(0, 1).map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-yellow-100 rounded-full text-xs font-bold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>

                                        {getDisplayPrice(product) && (
                                            <div className="text-2xl font-black">
                                                <span className='text-[16px] font-semibold text-black/80'>Starting at -</span> ₹{getDisplayPrice(product).toLocaleString()}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart size={18} /> Add to Cart
                                            </button>
                                            <Link
                                                to={`/product/${product._id}`}
                                                className="px-4 py-3 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
};

export default Browse;
