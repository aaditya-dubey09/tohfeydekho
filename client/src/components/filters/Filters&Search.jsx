import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { categoryDisplayNames } from '../../utils/constants.js';

const FilterSearch = ({ products, setFilteredProducts, initialCategory }) => {
    const location = useLocation();
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

    // Filter options - using actual backend enum values
    const filterOptions = {
        category: ['electronics', 'fashion', 'home_decor', 'books', 'toys', 'beauty', 'sports', 'jewelry', 'gadgets', 'accessories', 'stationery', 'kitchen', 'outdoor', 'health', 'food_beverage', 'fitness', 'footwear', 'watches', 'furniture', 'appliances', 'clothing'],
        budget_range: ['low', 'medium', 'high']
    };

    const TAG_LIMIT = 20; // Limit tags to show

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
        // Handle trending tag filters
        if (location.state?.filters) {
            const tagFilter = location.state.filters;
            const tagValue = tagFilter.occasion || tagFilter.emotion || tagFilter.personality;
            
            if (tagValue) {
                setSelectedFilters(prev => {
                    const updated = { ...prev };
                    if (tagFilter.occasion) updated.occasion = [tagValue];
                    if (tagFilter.emotion) updated.emotion = [tagValue];
                    if (tagFilter.personality) updated.personality = [tagValue];
                    return updated;
                });
            }
        }
    }, [location.state]);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, selectedFilters]);

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

    useEffect(() => {
        // Extract tags from products
        const tagMap = {
            relation: new Set(),
            occasion: new Set(),
            emotion: new Set(),
            personality: new Set()
        };

        products.forEach(product => {
            if (product.relation_tags) product.relation_tags.forEach(tag => tagMap.relation.add(tag));
            if (product.occasion_tags) product.occasion_tags.forEach(tag => tagMap.occasion.add(tag));
            if (product.emotion_tags) product.emotion_tags.forEach(tag => tagMap.emotion.add(tag));
            if (product.personality_tags) product.personality_tags.forEach(tag => tagMap.personality.add(tag));
        });

        // Convert to arrays and limit
        const tagsObj = {};
        Object.keys(tagMap).forEach(key => {
            const shuffled = Array.from(tagMap[key]).sort(() => Math.random() - 0.5);
            tagsObj[key] = shuffled.slice(0, 20);
        });

        setAllTags(tagsObj);
    }, [products]);

    return (
        <>
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
                                {filterType === 'category' ? (categoryDisplayNames[option] || option) : option}
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
        </>
    );
};

export default FilterSearch;
