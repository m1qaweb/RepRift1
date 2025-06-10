export const muscleGroupMapping: { [key: string]: string } = {
  // Chest
  "Bench Press": "Chest",
  "Dumbbell Press": "Chest",
  "Incline Bench Press": "Chest",
  "Decline Bench Press": "Chest",
  "Chest Fly": "Chest",
  "Dumbbell Fly": "Chest",
  "Push-up": "Chest",

  // Back
  Deadlift: "Back",
  "Pull-up": "Back",
  "Chin-up": "Back",
  "Lat Pulldown": "Back",
  "Bent Over Row": "Back",
  "T-Bar Row": "Back",
  "Seated Cable Row": "Back",
  "Dumbbell Row": "Back",

  // Legs
  Squat: "Legs",
  "Front Squat": "Legs",
  "Leg Press": "Legs",
  Lunge: "Legs",
  "Leg Extension": "Legs",
  "Leg Curl": "Legs",
  "Calf Raise": "Legs",
  "Good Morning": "Legs",

  // Shoulders
  "Overhead Press": "Shoulders",
  "Military Press": "Shoulders",
  "Dumbbell Shoulder Press": "Shoulders",
  "Arnold Press": "Shoulders",
  "Lateral Raise": "Shoulders",
  "Front Raise": "Shoulders",
  "Face Pull": "Shoulders",
  Shrug: "Shoulders",

  // Arms
  "Bicep Curl": "Arms",
  "Hammer Curl": "Arms",
  "Preacher Curl": "Arms",
  "Tricep Extension": "Arms",
  "Tricep Pushdown": "Arms",
  "Skull Crusher": "Arms",
  Dips: "Arms",

  // Abs
  Crunch: "Abs",
  "Leg Raise": "Abs",
  Plank: "Abs",
  "Russian Twist": "Abs",
};

export const getMuscleGroup = (exerciseName: string): string => {
  const lowerCaseName = exerciseName.toLowerCase();
  for (const key in muscleGroupMapping) {
    if (lowerCaseName.includes(key.toLowerCase())) {
      return muscleGroupMapping[key];
    }
  }
  return "Other";
};
