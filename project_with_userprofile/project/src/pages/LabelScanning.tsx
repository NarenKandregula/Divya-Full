import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import NutritionCard from '../components/NutritionCard';

function LabelScanning() {
  const [scanning, setScanning] = useState(false);
  const [nutritionData, setNutritionData] = useState<null | {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  }>(null);

  const handleImageUpload = async (file: File) => {
    setScanning(true); // Set scanning to true while the request is being processed
  
    // Create a new FormData object to hold the image file
    const formData = new FormData();
    formData.append('image', file);  // Attach the file directly to FormData

    try {
      // Send a POST request to the Flask API using fetch
      const response = await fetch('http://127.0.0.1:5000/label', {
        method: 'POST',
        body: formData, // Pass the FormData containing the image
      });

      // Handle the response
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // Parse the response as JSON
      const data = await response.json();

      console.log(data.data);

      // Set the actual nutrition data received from the API
      setNutritionData({
        calories: parseInt(data.data.calories) || 0,
        protein: parseInt(data.data.protein) || 0,
        carbs: parseInt(data.data.total_carbohydrate) || 0,
        fat: parseInt(data.data.total_fat) || 0,
        fiber: parseInt(data.data.dietary_fiber) || 0,
        sugar: parseInt(data.data.total_sugars) || 0,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setScanning(false); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Nutrition Label Scanner
      </h1>

      <ImageUploader
        onImageUpload={handleImageUpload}
        title="Upload Nutrition Label"
        description="Drag and drop a nutrition label image, or click to select"
      />

      {scanning && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing nutrition label...</p>
        </div>
      )}

      {nutritionData && !scanning && (
        <div className="mt-8">
          <NutritionCard
            title="Nutrition Information"
            nutrition={nutritionData}
          />
        </div>
      )}
    </div>
  );
}

export default LabelScanning;