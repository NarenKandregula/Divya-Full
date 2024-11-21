import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface UserProfileData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  healthGoal: string;
  hasAllergies: boolean;
  allergies: string;
  dietaryRestrictions: string;
}

interface UserProfileFormProps {
  onSubmit: (data: UserProfileData) => void;
}

function UserProfileForm({ onSubmit }: UserProfileFormProps) {
  const [formData, setFormData] = useState<UserProfileData>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    healthGoal: '',
    hasAllergies: false,
    allergies: '',
    dietaryRestrictions: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfileData, string>>>({});

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Lightly active (1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (3-5 days/week)' },
    { value: 'very', label: 'Very active (6-7 days/week)' },
    { value: 'super', label: 'Super active (2x training/physical job)' }
  ];

  const healthGoals = [
    { value: 'loss', label: 'Weight loss' },
    { value: 'maintenance', label: 'Weight maintenance' },
    { value: 'gain', label: 'Muscle gain' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfileData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age between 13 and 120';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.height || parseFloat(formData.height) < 50 || parseFloat(formData.height) > 300) {
      newErrors.height = 'Please enter a valid height between 50 and 300 cm';
    }

    if (!formData.weight || parseFloat(formData.weight) < 20 || parseFloat(formData.weight) > 500) {
      newErrors.weight = 'Please enter a valid weight between 20 and 500 kg';
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Please select your activity level';
    }

    if (!formData.healthGoal) {
      newErrors.healthGoal = 'Please select your health goal';
    }

    if (formData.hasAllergies && !formData.allergies.trim()) {
      newErrors.allergies = 'Please specify your allergies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof UserProfileData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } focus:border-green-500 focus:ring-green-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="13"
              max="120"
              value={formData.age}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.age ? 'border-red-300' : 'border-gray-300'
              } focus:border-green-500 focus:ring-green-500`}
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>
        </div>

        {/* Physical Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.gender ? 'border-red-300' : 'border-gray-300'
              } focus:border-green-500 focus:ring-green-500`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              min="50"
              max="300"
              step="0.1"
              value={formData.height}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.height ? 'border-red-300' : 'border-gray-300'
              } focus:border-green-500 focus:ring-green-500`}
            />
            {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="20"
              max="500"
              step="0.1"
              value={formData.weight}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.weight ? 'border-red-300' : 'border-gray-300'
              } focus:border-green-500 focus:ring-green-500`}
            />
            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
          </div>
        </div>

        {/* Activity and Goals */}
        <div className="space-y-6">
          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
              Activity Level
            </label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.activityLevel ? 'border-red-300' : 'border-gray-300'
              } focus:border-green-500 focus:ring-green-500`}
            >
              <option value="">Select activity level</option>
              {activityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.activityLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.activityLevel}</p>
            )}
          </div>

          <div>
            <label htmlFor="healthGoal" className="block text-sm font-medium text-gray-700">
              Health Goal
            </label>
            <select
              id="healthGoal"
              name="healthGoal"
              value={formData.healthGoal}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.healthGoal ? 'border-red-300' : 'border-gray-300'
              } focus:border-green-500 focus:ring-green-500`}
            >
              <option value="">Select health goal</option>
              {healthGoals.map(goal => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
            {errors.healthGoal && <p className="mt-1 text-sm text-red-600">{errors.healthGoal}</p>}
          </div>
        </div>

        {/* Dietary Concerns */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="hasAllergies"
                name="hasAllergies"
                checked={formData.hasAllergies}
                onChange={handleInputChange}
                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="hasAllergies" className="text-sm font-medium text-gray-700">
                I have food allergies
              </label>
            </div>
          </div>

          {formData.hasAllergies && (
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                Please specify your allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={2}
                value={formData.allergies}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.allergies ? 'border-red-300' : 'border-gray-300'
                } focus:border-green-500 focus:ring-green-500`}
                placeholder="e.g., peanuts, shellfish, dairy"
              />
              {errors.allergies && <p className="mt-1 text-sm text-red-600">{errors.allergies}</p>}
            </div>
          )}

          <div>
            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">
              Dietary Restrictions
            </label>
            <textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              rows={2}
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
              placeholder="e.g., vegetarian, vegan, gluten-free"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save Profile
          </button>
        </div>
      </div>
    </form>
  );
}

export default UserProfileForm;