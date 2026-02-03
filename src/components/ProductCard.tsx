import React, { useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../services/recommendationService';

interface ProductCardProps {
  product: Product;
  userRating?: number;
  onRate: (productId: string, rating: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userRating,
  onRate,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-all ${
              isLiked
                ? 'bg-red-100 text-red-600'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="inline-block bg-white/90 text-xs font-semibold px-2 py-1 rounded text-gray-700">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-700">
              {product.rating}
            </span>
            <span className="text-xs text-gray-500">
              ({product.review_count})
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-4 line-clamp-2 h-8">
          {product.description}
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">
              Your Rating
            </label>
            {userRating && (
              <span className="text-xs text-blue-600 font-semibold">
                {userRating.toFixed(1)}★
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => {
                  onRate(product.id, star);
                }}
                className="transition-all"
              >
                <Star
                  size={18}
                  className={`${
                    star <= (hoverRating || userRating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <ShoppingCart size={18} />
          Add to Cart
        </button>
        {product.amazon_link && (
          <a
            href={product.amazon_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 inline-block text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Buy on Amazon
          </a>
        )}
      </div>
    </div>
  );
};
