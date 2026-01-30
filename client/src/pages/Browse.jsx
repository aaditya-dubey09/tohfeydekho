import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productsAPI } from '../services/api';
import { addToCartThunk } from '../redux/slices/cart.thunk';
import FilterSearch from '../components/filters/Filters&Search';
import BrowseHeader from '../components/browse/BrowseHeader';
import ProductsByCategory from '../components/browse/ProductsByCategory';

const Browse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { wishlist } = useSelector(state => state.products);
    const [localWishlist, setLocalWishlist] = useState(new Set());

    useEffect(() => {
        setLocalWishlist(new Set(wishlist?.map(p => p._id) || []));
    }, [wishlist]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await productsAPI.getAll();
            setProducts(data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (productId) => {
        dispatch(addToCartThunk(productId));
    };

    const handleWishlist = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await productsAPI.toggleWishlist(productId);
            setLocalWishlist(prev => {
                const newSet = new Set(prev);
                if (newSet.has(productId)) {
                    newSet.delete(productId);
                } else {
                    newSet.add(productId);
                }
                return newSet;
            });
        } catch (error) {
            console.error('Wishlist error:', error);
        }
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
            <BrowseHeader />
            <FilterSearch
                products={products}
                setFilteredProducts={setFilteredProducts}
                initialCategory={location.state?.category || null}
            />
            <ProductsByCategory
                groupedProducts={groupedProducts}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
                localWishlist={localWishlist}
            />
        </div>
    );
};

export default Browse;
