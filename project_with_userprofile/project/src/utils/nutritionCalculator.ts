interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  healthGoal: string;
}

export function calculateDailyTargets(profile: UserProfile) {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  bmr = profile.gender === 'male' ? bmr + 5 : bmr - 161;

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    super: 1.9,
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers];

  // Adjust calories based on health goal
  let targetCalories = tdee;
  switch (profile.healthGoal) {
    case 'loss':
      targetCalories *= 0.8; // 20% deficit
      break;
    case 'gain':
      targetCalories *= 1.1; // 10% surplus
      break;
    default:
      // maintenance stays at TDEE
      break;
  }

  // Calculate macronutrient targets
  const protein = profile.weight * 2; // 2g per kg of body weight
  const fat = (targetCalories * 0.25) / 9; // 25% of calories from fat
  const carbs = (targetCalories - (protein * 4 + fat * 9)) / 4; // Remaining calories from carbs

  // Water intake (L) - Basic calculation
  const water = profile.weight * 0.033;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    water: Number(water.toFixed(1)),
  };
}