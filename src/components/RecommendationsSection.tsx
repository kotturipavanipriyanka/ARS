import React, { useEffect, useState } from 'react';
import { Recommendation, RecommendationService } from '../services/recommendationService';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';
import { Sparkles, TrendingUp } from 'lucide-react';

interface RecommendationsSectionProps {
  userId: string;
  onRate: (productId: string, rating: number) => void;
  userRatings: Map<string, number>;
  triggerRefresh: number;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  userId,
  onRate,
  userRatings,
  triggerRefresh,
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      const recs = await RecommendationService.getProductRecommendations(userId, 6);
      setRecommendations(recs);
      setLoading(false);
    };

    loadRecommendations();
  }, [userId, triggerRefresh]);

  if (loading) {
    return (
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">
              Personalized For You
            </h2>
          </div>
          <TrendingUp className="text-green-600" size={20} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">
            Personalized For You
          </h2>
        </div>
        <TrendingUp className="text-green-600" size={20} />
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-gray-700 font-medium mb-2">
            Rate a few products to get personalized recommendations
          </p>
          <p className="text-sm text-gray-600">
            Our algorithm will analyze your preferences and find products you'll love
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Based on your preferences, here are products we think you'll enjoy
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.product.id}>
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                      Recommended
                    </span>
                    <span className="text-gray-600">{rec.reason}</span>
                  </div>
                </div>
                <ProductCard
                  product={rec.product}
                  userRating={userRatings.get(rec.product.id)}
                  onRate={onRate}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
