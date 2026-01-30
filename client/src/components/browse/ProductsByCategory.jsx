import React from 'react';
import { categoryDisplayNames } from '../../utils/constants';
import ProductCard from '../cards/ProductCard';

const ProductsByCategory = ({ groupedProducts, onAddToCart, onWishlist, localWishlist }) => {
  const categories = Object.keys(groupedProducts).sort();

  if (categories.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-2xl font-bold">No products found</p>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <>
      {categories.map(category => (
        <section key={category} className="space-y-6">
          <div className="border-b-4 border-black pb-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
              {categoryDisplayNames[category] || category}
            </h2>
            <p className="text-gray-600 font-medium">
              {groupedProducts[category].length} {groupedProducts[category].length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedProducts[category].map(product => (
              <ProductCard
                key={product._id}
                product={product}
                variant="detailed"
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
                isWishlisted={localWishlist.has(product._id)}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default ProductsByCategory;
