import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Receipt, ClipboardList, UserCircle } from 'lucide-react';
import DailyTargets from '../components/DailyTargets';
import { calculateDailyTargets } from '../utils/nutritionCalculator';

// Sample user profile for demonstration
const sampleProfile = {
  weight: 70,
  height: 175,
  age: 30,
  gender: 'male',
  activityLevel: 'moderate',
  healthGoal: 'maintenance',
};

function Home() {
  const [dailyTargets] = useState(calculateDailyTargets(sampleProfile));
  const [currentProgress] = useState({
    calories: 1200,
    protein: 45,
    carbs: 120,
    fat: 35,
    water: 1.5,
  });

  type ApiResponse = {
    message?: string; 
    error?: string;
  };
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  
  const testApi = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        setApiResponse({ error: error.message });
      } else {
        setApiResponse({ error: 'An unknown error occurred' });
      }
    }
  };
  

  const features = [
    {
      path: '/label-scanning',
      icon: Receipt,
      title: 'Label Scanning',
      description: 'Scan nutrition labels from packaged foods',
    },
    {
      path: '/plate-scanning',
      icon: Camera,
      title: 'Plate Scanning',
      description: 'Analyze your meals with AI-powered image recognition',
    },
    {
      path: '/manual-entry',
      icon: ClipboardList,
      title: 'Manual Entry',
      description: 'Manually track your nutritional intake',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-600">
            Track your nutrition with ease
          </p>
        </div>
        <Link
          to="/profile"
          className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <UserCircle className="h-6 w-6 text-green-600" />
          <span className="text-gray-700">View Profile</span>
        </Link>
      </div>

      <DailyTargets targets={dailyTargets} current={currentProgress} />

      <div className="grid md:grid-cols-3 gap-8">
        {features.map(({ path, icon: Icon, title, description }) => (
          <Link
            key={path}
            to={path}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {title}
            </h2>
            <p className="text-gray-600 text-center">{description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-green-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Why Choose NutriScan?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Accurate Analysis</h3>
            <p className="text-gray-600">
              Get precise nutritional information using our advanced AI technology
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple interface for quick and efficient nutrition tracking
            </p>
          </div>
        </div>
      </div>

      {/* API Test Block */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Test API
        </h2>
        <button
          onClick={testApi}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Fetch API Response
        </button>
        {apiResponse && (
          <div className="mt-4 bg-gray-100 rounded-md p-4">
            <h3 className="font-semibold text-gray-900 mb-2">API Response:</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;