import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, BarChart3, Package, MessageSquare, X, Upload, Tag } from 'lucide-react';
import { adminAPI, productsAPI } from '../services/api';
// TODO: Add a custom tag input field and add to all the tags to let admins add custom tags - which will then be added to the predefined tags list

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    budget_range: 'medium',
    relation_tags: [],
    occasion_tags: [],
    emotion_tags: [],
    personality_tags: [],
    expert_rating: 0,
    retailer_prices: [],
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  // Predefined tag options (matching quiz options)
  const tagOptions = {
    relation: ['Friend', 'Partner', 'Family', 'Colleague', 'Boss', 'Teacher', 'Pet Owner', 'Neighbor'],
    occasion: ['Birthday', 'Anniversary', 'Wedding', 'Graduation', 'New Job', 'Housewarming', 'Baby Shower', 'Festival', 'Just Because'],
    emotion: ['Romantic', 'Funny', 'Sentimental', 'Practical', 'Luxurious', 'Quirky', 'Thoughtful'],
    personality: ['Techie', 'Artist', 'Fitness Enthusiast', 'Foodie', 'Bookworm', 'Traveler', 'Gamer', 'Fashion Lover', 'Nature Lover', 'DIY Enthusiast']
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setError('');
      if (activeTab === 'products') {
        const { data } = await productsAPI.getAll();
        setProducts(data.data || []);
      } else if (activeTab === 'analytics') {
        const { data } = await adminAPI.getAnalytics();
        setAnalytics(data.data);
      } else if (activeTab === 'consultations') {
        const { data } = await adminAPI.getAllConsultations();
        setConsultations(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      budget_range: product.budget_range || 'medium',
      relation_tags: product.relation_tags || [],
      occasion_tags: product.occasion_tags || [],
      emotion_tags: product.emotion_tags || [],
      personality_tags: product.personality_tags || [],
      expert_rating: product.expert_rating || 0,
      retailer_prices: product.retailer_prices || [],
      images: product.images || []
    });
    setImagePreviews(product.images || []);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      budget_range: 'medium',
      relation_tags: [],
      occasion_tags: [],
      emotion_tags: [],
      personality_tags: [],
      expert_rating: 0,
      retailer_prices: [],
      images: []
    });
    setImagePreviews([]);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, { url: reader.result, isNew: true, file }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const newImages = formData.images.filter((_, i) => {
      const indexInNewImages = index - (imagePreviews.length - formData.images.length);
      return indexInNewImages !== i;
    });
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleDeleteImage = async (productId, publicId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await adminAPI.deleteProductImage(productId, publicId);
      setSuccess('Image deleted');
      setTimeout(() => fetchData(), 500);
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  const toggleTag = (tagType, value) => {
    setFormData(prev => {
      const currentTags = prev[tagType];
      const newTags = currentTags.includes(value)
        ? currentTags.filter(t => t !== value)
        : [...currentTags, value];
      return { ...prev, [tagType]: newTags };
    });
  };

  const addRetailerPrice = () => {
    setFormData(prev => ({
      ...prev,
      retailer_prices: [...prev.retailer_prices, {
        retailer_id: '',
        price: '',
        discount_percentage: 0,
        link: '',
        is_exact: true
      }]
    }));
  };

  const removeRetailerPrice = (index) => {
    setFormData(prev => ({
      ...prev,
      retailer_prices: prev.retailer_prices.filter((_, i) => i !== index)
    }));
  };

  const updateRetailerPrice = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.retailer_prices];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, retailer_prices: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.retailer_prices.length === 0) {
        setError('Please add at least one retailer price');
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('budget_range', formData.budget_range);
      submitData.append('expert_rating', formData.expert_rating);

      // Add tags as JSON arrays
      submitData.append('relation_tags', JSON.stringify(formData.relation_tags));
      submitData.append('occasion_tags', JSON.stringify(formData.occasion_tags));
      submitData.append('emotion_tags', JSON.stringify(formData.emotion_tags));
      submitData.append('personality_tags', JSON.stringify(formData.personality_tags));

      submitData.append('retailer_prices', JSON.stringify(formData.retailer_prices));

      formData.images.forEach(img => {
        if (img instanceof File) {
          submitData.append('images', img);
        }
      });

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct._id, submitData, config);
        setSuccess('Product updated successfully');
      } else {
        await adminAPI.createProduct(submitData, config);
        setSuccess('Product created successfully');
      }

      setShowModal(false);
      setTimeout(() => {
        setSuccess('');
        fetchData();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setLoading(true);
      await adminAPI.deleteProduct(id);
      setSuccess('Product deleted');
      setTimeout(() => fetchData(), 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPrice = (product) => {
    if (!product.retailer_prices || product.retailer_prices.length === 0) return 'N/A';
    const prices = product.retailer_prices.map(r => r.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) return `₹${minPrice}`;
    return `₹${minPrice} - ₹${maxPrice}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Same as before */}
      <div className="w-full lg:w-64 space-y-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'analytics' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
        >
          <BarChart3 size={20} /> Analytics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'products' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
        >
          <Package size={20} /> Products
        </button>
        <button
          onClick={() => setActiveTab('consultations')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'consultations' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
        >
          <MessageSquare size={20} /> Consultations
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Analytics Tab - Same as before */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Total Products</p>
                <p className="text-4xl font-black mt-2">{analytics.summary.totalProducts}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Quiz Submissions</p>
                <p className="text-4xl font-black mt-2">{analytics.summary.totalQuizzes}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Consultations</p>
                <p className="text-4xl font-black mt-2">{analytics.summary.totalConsultations}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="font-bold text-lg">Top Products</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-bold text-sm">Product Name</th>
                    <th className="px-6 py-4 font-bold text-sm">Views</th>
                    <th className="px-6 py-4 font-bold text-sm">Wishlists</th>
                    <th className="px-6 py-4 font-bold text-sm">Carts</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {analytics.productStats && analytics.productStats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{stat.name}</td>
                      <td className="px-6 py-4 text-gray-600">{stat.views || 0}</td>
                      <td className="px-6 py-4 text-gray-600">{stat.wishlist_count || 0}</td>
                      <td className="px-6 py-4 text-gray-600">{stat.cart_count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-black">Manage Products</h2>
              <button
                onClick={handleAddClick}
                className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-gray-800 transition-colors"
              >
                <Plus size={20} /> Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 font-bold mb-4">No products yet</p>
                <button
                  onClick={handleAddClick}
                  className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800"
                >
                  Create First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <div key={product._id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-24 sm:h-24 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0].url} className="w-full h-full rounded-xl object-cover" alt={product.name} />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                            <Package size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-bold text-lg">{product.name}</p>
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        <p className="text-gray-700 text-sm mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-4 flex-wrap flex-row">
                          <div className='flex gap-2 items-center'>
                            <p className="text-sm text-gray-500">Price Range</p>
                            <p className="font-bold">{getDisplayPrice(product)}</p>
                          </div>
                          {product.retailer_prices && product.retailer_prices.length > 0 && (
                            <div className='flex gap-2 items-center'>
                              <p className="text-sm text-gray-500">Retailers</p>
                              <p className="font-bold">{product.retailer_prices.length}</p>
                            </div>
                          )}
                          {/* {product.expert_rating > 0 && (
                            <div>
                              <p className="text-sm text-gray-500">Rating</p>
                              <p className="font-bold">⭐ {product.expert_rating}/5</p>
                            </div>
                          )} */}
                          {product.images && product.images.length > 0 && (
                            <div className='flex gap-2 items-center'>
                              <p className="text-sm text-gray-500">Images</p>
                              <p className="font-bold">{product.images.length}</p>
                            </div>
                          )}
                        </div>
                        {/* Show tags */}
                        {(product.relation_tags?.length > 0 || product.occasion_tags?.length > 0 || product.personality_tags?.length > 0) && (
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {product.relation_tags?.map(tag => (
                              <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{tag}</span>
                            ))}
                            {product.occasion_tags?.map(tag => (
                              <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{tag}</span>
                            ))}
                            {product.personality_tags?.map(tag => (
                              <span key={tag} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-3 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Consultations Tab - Same as before */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black">Consultation Requests</h2>
            {consultations.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 font-bold">No consultation requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map(c => (
                  <div key={c._id} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <p className="font-bold text-lg">{c.name}</p>
                        {c.user?.email && <p className="text-sm text-gray-600">Email: {c.user.email}</p>}
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${c.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : c.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-gray-700"><span className="font-semibold">Contact:</span> {c.contact}</p>
                    <p className="text-gray-700"><span className="font-semibold">Context:</span> {c.context}</p>
                    {c.amount && <p className="text-gray-700"><span className="font-semibold">Amount:</span> ₹{c.amount}</p>}
                    {c.payment_id && <p className="text-xs text-gray-500">Payment ID: {c.payment_id}</p>}
                    <p className="text-xs text-gray-400">Requested: {new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal - Enhanced with Tags */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-8">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white z-10">
              <h2 className="text-2xl font-black">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                  <Package size={20} /> Basic Information
                </h3>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2">Category *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                    placeholder="e.g., Jewelry, Accessories, Gadgets"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2">Description *</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Budget Range & Expert Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Budget Range *</label>
                    <select
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                      value={formData.budget_range}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                    >
                      <option value="low">Low Budget</option>
                      <option value="medium">Medium Budget</option>
                      <option value="high">High Budget</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Expert Rating (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                      value={formData.expert_rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, expert_rating: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendation Tags Section */}
              <div className="border-t-2 border-gray-200 pt-6 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                  <Tag size={20} /> Recommendation Tags <span className="text-sm text-gray-500 font-normal">(Optional - Improves matching)</span>
                </h3>

                {/* Relation Tags */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">Relation Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.relation.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag('relation_tags', tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.relation_tags.includes(tag)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasion Tags */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">Occasion Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.occasion.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag('occasion_tags', tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.occasion_tags.includes(tag)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emotion Tags */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">Emotion/Style Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.emotion.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag('emotion_tags', tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.emotion_tags.includes(tag)
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personality Tags */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-3">Personality Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.personality.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag('personality_tags', tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.personality_tags.includes(tag)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Retailer Prices Section - Same as before */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold uppercase tracking-widest">
                    Retailer Prices * <span className="text-xs text-gray-500 normal-case">(Add at least one)</span>
                  </label>
                  <button
                    type="button"
                    onClick={addRetailerPrice}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Retailer
                  </button>
                </div>

                {formData.retailer_prices.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">
                    ⚠️ You must add at least one retailer with pricing information
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {formData.retailer_prices.map((retailer, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Retailer #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeRetailerPrice(idx)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Remove retailer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1 block">
                              Retailer Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., Amazon, Flipkart"
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-black outline-none"
                              value={retailer.retailer_id}
                              onChange={(e) => updateRetailerPrice(idx, 'retailer_id', e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1 block">
                              Price (₹) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              placeholder="Product price"
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-black outline-none"
                              value={retailer.price}
                              onChange={(e) => updateRetailerPrice(idx, 'price', parseFloat(e.target.value) || '')}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1 block">
                              Discount % (Optional)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="e.g., 10"
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-black outline-none"
                              value={retailer.discount_percentage || ''}
                              onChange={(e) => updateRetailerPrice(idx, 'discount_percentage', parseFloat(e.target.value) || 0)}
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-6">
                            <input
                              type="checkbox"
                              id={`exact-${idx}`}
                              checked={retailer.is_exact}
                              onChange={(e) => updateRetailerPrice(idx, 'is_exact', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <label htmlFor={`exact-${idx}`} className="text-xs font-bold uppercase tracking-widest text-gray-600 cursor-pointer">
                              Exact Price
                            </label>
                            <span className="text-xs text-gray-500" title="Uncheck if price is approximate/starting from">ℹ️</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1 block">
                            Product Link *
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="https://example.com/product"
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-black outline-none"
                            value={retailer.link}
                            onChange={(e) => updateRetailerPrice(idx, 'link', e.target.value)}
                          />
                        </div>

                        {retailer.price && (
                          <div className="bg-white border border-gray-200 rounded p-2 text-xs">
                            <span className="text-gray-500">Final Price: </span>
                            <span className="font-bold">
                              ₹{(retailer.price * (1 - (retailer.discount_percentage || 0) / 100)).toFixed(2)}
                            </span>
                            {retailer.discount_percentage > 0 && (
                              <span className="text-green-600 ml-2">({retailer.discount_percentage}% off)</span>
                            )}
                            {!retailer.is_exact && (
                              <span className="text-amber-600 ml-2">(Starting from)</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest mb-2">Product Images (Max 5)</label>
                <label className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-bold">Click to upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imagePreviews.length >= 5}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2">Preview ({imagePreviews.length})</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.url}
                          alt={`Preview ${idx}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <X size={20} className="text-white" />
                        </button>
                        {!img.isNew && editingProduct && (
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(editingProduct._id, img.public_id)}
                            className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-full"
                            title="Delete from server"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading || formData.retailer_prices.length === 0}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;