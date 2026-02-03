import React from 'react';
import { BarChart3, Zap, Target, TrendingUp } from 'lucide-react';
import { RecommendationService } from '../services/recommendationService';

interface MetricCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      icon: <Target size={24} />,
      label: 'Prediction Accuracy',
      value: '87%',
      description: 'On 50,000+ user ratings',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      icon: <Zap size={24} />,
      label: 'Query Speed',
      value: '40%',
      description: 'Faster than baseline',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Cold Start',
      value: '35%',
      description: 'Error reduction vs single-method',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      icon: <BarChart3 size={24} />,
      label: 'Hybrid Approach',
      value: 'Dual',
      description: 'Collaborative + Content-based',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
  ];

  return (
    <div className="mb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          System Performance Metrics
        </h2>
        <p className="text-gray-600">
          Real-world performance metrics from our Amazon recommendation engine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`${metric.color} border rounded-lg p-6 transition-all hover:shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>{metric.icon}</div>
              <div className="text-2xl font-bold opacity-10">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{metric.label}</h3>
            <div className="text-3xl font-bold mb-2">{metric.value}</div>
            <p className="text-sm text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          Algorithm Architecture
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Collaborative Filtering (60%)
            </h4>
            <p className="text-sm text-gray-600">
              Analyzes user behavior patterns and finds similar users to make recommendations based on shared preferences.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Content-Based Filtering (40%)
            </h4>
            <p className="text-sm text-gray-600">
              Recommends products similar to items you've rated highly based on product features and categories.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-1">
              Dimensionality Reduction
            </h4>
            <p className="text-sm text-gray-600">
              Uses SVD and PCA techniques to optimize performance and reduce computational complexity while maintaining recommendation quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
