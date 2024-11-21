import React from 'react';
import { Activity, Droplet, Target } from 'lucide-react';

interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface DailyTargetsProps {
  targets: NutritionTargets;
  current?: Partial<NutritionTargets>;
}

function DailyTargets({ targets, current = {} }: DailyTargetsProps) {
  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatValue = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  const metrics = [
    {
      label: 'Calories',
      current: current.calories || 0,
      target: targets.calories,
      unit: 'kcal',
      icon: Target,
    },
    {
      label: 'Protein',
      current: current.protein || 0,
      target: targets.protein,
      unit: 'g',
      icon: Activity,
    },
    {
      label: 'Carbs',
      current: current.carbs || 0,
      target: targets.carbs,
      unit: 'g',
      icon: Activity,
    },
    {
      label: 'Fat',
      current: current.fat || 0,
      target: targets.fat,
      unit: 'g',
      icon: Activity,
    },
    {
      label: 'Water',
      current: current.water || 0,
      target: targets.water,
      unit: 'L',
      icon: Droplet,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Targets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(({ label, current, target, unit, icon: Icon }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">{label}</span>
              </div>
              <span className="text-sm text-gray-500">
                {formatValue(current)}/{formatValue(target)} {unit}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress(current, target)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyTargets;