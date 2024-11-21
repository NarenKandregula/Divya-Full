import React, { useState } from 'react';
import { Search } from 'lucide-react';
import NutritionCard from '../components/NutritionCard';

interface FoodItem {
  name: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

function ManualEntry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulated API call - replace with actual implementation
    setTimeout(() => {
      setSelectedFood({
        name: searchTerm,
        nutrition: {
          calories: 150,
          protein: 12,
          carbs: 15,
          fat: 8
        }
      });
      setLoading(false);
    }, 1000);
  };

  const calculateAdjustedNutrition = () => {
    if (!selectedFood) return null;
    const multiplier = quantity / 100;
    return {
      calories: Math.round(selectedFood.nutrition.calories * multiplier),
      protein: Math.round(selectedFood.nutrition.protein * multiplier),
      carbs: Math.round(selectedFood.nutrition.carbs * multiplier),
      fat: Math.round(selectedFood.nutrition.fat * multiplier)
    };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Manual Food Entry
      </h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a food item..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <button
            type="submit"
            disabled={loading || !searchTerm}
            className="absolute right-2 top-2 px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {selectedFood && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedFood.name}
            </h2>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Quantity (g):</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {calculateAdjustedNutrition() && (
            <NutritionCard
              title={`Nutrition for ${quantity}g`}
              nutrition={calculateAdjustedNutrition()!}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ManualEntry;