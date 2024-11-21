import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileForm from '../components/UserProfileForm';
import { calculateDailyTargets } from '../utils/nutritionCalculator';

function Profile() {
  const navigate = useNavigate();

  const handleProfileSubmit = (data: any) => {
    // Calculate targets based on profile data
    const targets = calculateDailyTargets({
      weight: parseFloat(data.weight),
      height: parseFloat(data.height),
      age: parseInt(data.age),
      gender: data.gender,
      activityLevel: data.activityLevel,
      healthGoal: data.healthGoal,
    });

    // TODO: Save profile and targets to backend
    console.log('Calculated targets:', targets);
    
    // Navigate back to home
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Your Profile
      </h1>
      <UserProfileForm onSubmit={handleProfileSubmit} />
    </div>
  );
}

export default Profile;