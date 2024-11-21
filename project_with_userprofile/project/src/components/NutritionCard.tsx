import React from 'react';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface NutritionCardProps {
  title: string;
  nutrition: NutritionInfo;
}

function NutritionCard({ title, nutrition }: NutritionCardProps) {
  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
    { label: 'Protein', value: nutrition.protein, unit: 'g' },
    { label: 'Carbs', value: nutrition.carbs, unit: 'g' },
    { label: 'Fat', value: nutrition.fat, unit: 'g' },
    // ...(nutrition.fiber ? [{ label: 'Fiber', value: nutrition.fiber, unit: 'g' }] : []),
    // ...(nutrition.sugar ? [{ label: 'Sugar', value: nutrition.sugar, unit: 'g' }] : [])
    { label: 'Fiber', value: nutrition?.fiber ?? 0, unit: 'g' },  // Optional chaining with fallback
    { label: 'Sugar', value: nutrition?.sugar ?? 0, unit: 'g' } 
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-green-600 px-4 py-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {nutritionItems.map(({ label, value, unit }) => (
            <div key={label} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-lg font-semibold text-gray-900">
                {value} {unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NutritionCard;