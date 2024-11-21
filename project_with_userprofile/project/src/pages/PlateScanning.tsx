import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import NutritionCard from '../components/NutritionCard';

function PlateScanning() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<null | {
    foodName: string;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }>(null);

  const handleImageUpload = async (file: File) => {
    setScanning(true);
    // Simulated API call - replace with actual implementation
    setTimeout(() => {
      setResults({
        foodName: 'Grilled Chicken Salad',
        nutrition: {
          calories: 350,
          protein: 32,
          carbs: 12,
          fat: 18
        }
      });
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Plate Scanner
      </h1>

      <ImageUploader
        onImageUpload={handleImageUpload}
        title="Upload Plate Image"
        description="Take a photo of your meal to analyze its nutritional content"
      />

      {scanning && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your meal...</p>
        </div>
      )}

      {results && !scanning && (
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Detected Food
            </h2>
            <p className="text-lg text-gray-700">{results.foodName}</p>
          </div>
          
          <NutritionCard
            title="Estimated Nutrition Information"
            nutrition={results.nutrition}
          />
        </div>
      )}
    </div>
  );
}

export default PlateScanning;