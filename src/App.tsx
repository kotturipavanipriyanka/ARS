import React, { useState, useEffect } from 'react';
import { ShoppingBag, LogOut, RotateCw } from 'lucide-react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ProductCard } from './components/ProductCard';
import { SkeletonCard } from './components/SkeletonCard';
import { SearchBar } from './components/SearchBar';
import {
  RecommendationService,
  Product,
  Recommendation,
} from './services/recommendationService';

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userRatings, setUserRatings] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const initializeUser = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        await loadUserData(storedUserId);
      } else {
        const newUserId = crypto.randomUUID();
        localStorage.setItem('userId', newUserId);
        setUserId(newUserId);
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const loadUserData = async (id: string) => {
    const allProducts = await RecommendationService.getAllProducts();
    setProducts(allProducts);

    const ratings = await RecommendationService.getUserRatings(id);
    setUserRatings(ratings);
  };

  const runSearch = async (q: string, minR: number) => {
    setSearching(true);
    setQuery(q);
    setMinRating(minR);
    const results = await RecommendationService.searchProducts(q, minR, 20);
    setProducts(results);
    setSearching(false);

    if (userId) {
      const recs = await RecommendationService.getProductRecommendations(userId, q, 6);
      setRecommendations(recs);
    }
  };

  const handleRate = async (productId: string, rating: number) => {
    if (!userId) return;

    await RecommendationService.submitRating(userId, productId, rating);

    const updatedRatings = new Map(userRatings);
    updatedRatings.set(productId, rating);
    setUserRatings(updatedRatings);

    // refresh recommendations for current search
    if (query && userId) {
      const recs = await RecommendationService.getProductRecommendations(userId, query, 6);
      setRecommendations(recs);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setUserRatings(new Map());
    location.reload();
  };

  if (loading || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SmartCart AI</h1>
                <p className="text-xs text-gray-500">Search → Rate → Refine</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">{userRatings.size} items rated</p>
                <p className="text-xs text-gray-500">Session active</p>
              </div>

              <button
                onClick={() => {
                  // refresh recommendations
                  if (userId && query) {
                    RecommendationService.getProductRecommendations(userId, query, 6).then(setRecommendations);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh recommendations"
              >
                <RotateCw size={20} className="text-gray-600" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">New Session</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnalyticsDashboard />

        <SearchBar onSearch={runSearch} isLoading={searching} />

        {recommendations.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refined Recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.product.id}>
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">Recommended</span>
                      <span className="text-gray-600">{rec.reason}</span>
                    </div>
                  </div>
                  <ProductCard product={rec.product} userRating={userRatings.get(rec.product.id)} onRate={handleRate} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searching && products.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} userRating={userRatings.get(product.id)} onRate={handleRate} />
                ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
              <p className="text-sm text-gray-600">Search for a product or model, rate items you know, and the system refines recommendations based on your preferences.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Technologies</h3>
              <p className="text-sm text-gray-600">Frontend: React + Vite. Backend: Node/Express with a simple JSON store for prototyping.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600">Add more attributes, real DB, and advanced ML models to improve personalization.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
            <p>© 2026 SmartCart AI. Search → Rate → Refine.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
