// /src/utils/Api.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  heightCm?: number;
  goals?: {
    weightKg?: number;
  };
  initialSetupCompleted?: boolean;
}

export interface MasterExercise {
  id: string;
  name: string;
  category:
    | "Strength"
    | "Cardio"
    | "Stretching"
    | "Plyometrics"
    | "Mobility"
    | "Stability"
    | "Power";
  bodyPart:
    | "Chest"
    | "Back"
    | "Legs"
    | "Shoulders"
    | "Biceps"
    | "Triceps"
    | "Core"
    | "Full Body"
    | "Glutes"
    | "Arms";
  equipment: string[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restInterval: number;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  createdBy: string;
}

export interface CompletedSet {
  reps: number | null;
  weight: number | null;
  completed: boolean;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  programId: string;
  programTitle: string;
  date: string;
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
  completedExercises: CompletedExercise[];
}

export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  bmi?: number;
  bodyFatPercentage?: number;
}

// --- Mock Data Store ---

let nextId = 100;
const generateId = (prefix: string) => `${prefix}-${nextId++}`;

let mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Taylor",
    email: "test@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    bio: "Fitness enthusiast focused on strength training and progressive overload.",
    heightCm: 180,
    goals: {
      weightKg: 80,
    },
    initialSetupCompleted: true,
  },
];

let mockPrograms: Program[] = [
  {
    id: "prog-1",
    createdBy: "user-1",
    title: "Classic Push Day",
    description: "Focuses on chest, shoulders, and triceps.",
    exercises: [
      {
        id: "master-1",
        name: "Barbell Bench Press",
        sets: 3,
        reps: "5-8",
        restInterval: 90,
      },
      {
        id: "master-4",
        name: "Overhead Press",
        sets: 3,
        reps: "8-12",
        restInterval: 75,
      },
      {
        id: "master-7",
        name: "Tricep Pushdown",
        sets: 3,
        reps: "10-15",
        restInterval: 60,
      },
    ],
  },
  {
    id: "prog-2",
    createdBy: "user-1",
    title: "Heavy Pull Day",
    description: "For building back and bicep thickness.",
    exercises: [
      {
        id: "master-3",
        name: "Deadlift",
        sets: 1,
        reps: "5",
        restInterval: 180,
      },
      {
        id: "master-5",
        name: "Pull Up",
        sets: 3,
        reps: "AMRAP",
        restInterval: 90,
      },
      {
        id: "master-6",
        name: "Dumbbell Curl",
        sets: 3,
        reps: "10-15",
        restInterval: 60,
      },
    ],
  },
];

let mockBodyMetrics: BodyMetric[] = [
  { id: "bm-1", userId: "user-1", date: "2024-03-01", weightKg: 85.5 },
  { id: "bm-2", userId: "user-1", date: "2024-03-08", weightKg: 85.1 },
  { id: "bm-3", userId: "user-1", date: "2024-03-15", weightKg: 84.7 },
  { id: "bm-4", userId: "user-1", date: "2024-03-22", weightKg: 84.9 },
  { id: "bm-5", userId: "user-1", date: "2024-03-29", weightKg: 83.9 },
  { id: "bm-6", userId: "user-1", date: "2024-04-05", weightKg: 83.5 },
  { id: "bm-7", userId: "user-1", date: "2024-04-12", weightKg: 83.1 },
  { id: "bm-8", userId: "user-1", date: "2024-04-19", weightKg: 82.8 },
  { id: "bm-9", userId: "user-1", date: "2024-04-26", weightKg: 82.5 },
  { id: "bm-10", userId: "user-1", date: "2024-05-03", weightKg: 82.2 },
  { id: "bm-11", userId: "user-1", date: "2024-05-10", weightKg: 82.3 },
  { id: "bm-12", userId: "user-1", date: "2024-05-17", weightKg: 81.9 },
];

let mockWorkoutLogs: WorkoutLog[] = [
  {
    id: "log-1",
    userId: "user-1",
    programId: "prog-1",
    programTitle: "Classic Push Day",
    date: "2024-04-01",
    durationMinutes: 65,
    caloriesBurned: 450,
    completedExercises: [
      {
        exerciseId: "master-1",
        exerciseName: "Barbell Bench Press",
        sets: [
          { reps: 8, weight: 100, completed: true },
          { reps: 7, weight: 100, completed: true },
          { reps: 6, weight: 100, completed: true },
        ],
      },
    ],
  },
  {
    id: "log-2",
    userId: "user-1",
    programId: "prog-2",
    programTitle: "Heavy Pull Day",
    date: "2024-04-03",
    durationMinutes: 70,
    caloriesBurned: 500,
    completedExercises: [
      {
        exerciseId: "master-3",
        exerciseName: "Deadlift",
        sets: [{ reps: 5, weight: 150, completed: true }],
      },
    ],
  },
  {
    id: "log-3",
    userId: "user-1",
    programId: "prog-1",
    programTitle: "Classic Push Day",
    date: "2024-04-08",
    durationMinutes: 68,
    caloriesBurned: 470,
    completedExercises: [
      {
        exerciseId: "master-1",
        exerciseName: "Barbell Bench Press",
        sets: [
          { reps: 8, weight: 102.5, completed: true },
          { reps: 8, weight: 102.5, completed: true },
          { reps: 7, weight: 102.5, completed: true },
        ],
      },
    ],
  },
  {
    id: "log-4",
    userId: "user-1",
    programId: "prog-2",
    programTitle: "Heavy Pull Day",
    date: "2024-04-15",
    durationMinutes: 75,
    caloriesBurned: 520,
    completedExercises: [
      {
        exerciseId: "master-3",
        exerciseName: "Deadlift",
        sets: [{ reps: 5, weight: 155, completed: true }],
      },
    ],
  },
  {
    id: "log-5",
    userId: "user-1",
    programId: "prog-1",
    programTitle: "Classic Push Day",
    date: "2024-04-22",
    durationMinutes: 72,
    caloriesBurned: 510,
    completedExercises: [
      {
        exerciseId: "master-1",
        exerciseName: "Barbell Bench Press",
        sets: [
          { reps: 8, weight: 105, completed: true },
          { reps: 8, weight: 105, completed: true },
          { reps: 8, weight: 105, completed: true },
        ],
      },
    ],
  },
  {
    id: "log-6",
    userId: "user-1",
    programId: "prog-2",
    programTitle: "Heavy Pull Day",
    date: "2024-04-29",
    durationMinutes: 80,
    caloriesBurned: 550,
    completedExercises: [
      {
        exerciseId: "master-3",
        exerciseName: "Deadlift",
        sets: [{ reps: 5, weight: 160, completed: true }],
      },
    ],
  },
  {
    id: "log-7",
    userId: "user-1",
    programId: "prog-1",
    programTitle: "Classic Push Day",
    date: "2024-05-06",
    durationMinutes: 70,
    caloriesBurned: 490,
    completedExercises: [
      {
        exerciseId: "master-1",
        exerciseName: "Barbell Bench Press",
        sets: [
          { reps: 6, weight: 107.5, completed: true },
          { reps: 5, weight: 107.5, completed: true },
          { reps: 5, weight: 107.5, completed: true },
        ],
      },
    ],
  },
];

const simulateDelay = (ms: number = 800) =>
  new Promise((res) => setTimeout(res, ms));

// --- Auth ---
export const fakeLogin = async (email: string, pass: string): Promise<User> => {
  await simulateDelay();
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (user && pass) {
    return JSON.parse(JSON.stringify(user));
  }
  throw new Error("Invalid credentials.");
};
export const fakeLogout = async () => await simulateDelay(200);
export const fakeSignup = async (
  name: string,
  email: string,
  pass: string
): Promise<User> => {
  await simulateDelay();
  if (mockUsers.some((u) => u.email === email)) {
    throw new Error("Email address is already in use.");
  }
  const newUser: User = {
    id: generateId("user"),
    name,
    email,
    initialSetupCompleted: false,
    bio: "",
    heightCm: undefined,
    avatarUrl: "",
  };
  mockUsers.push(newUser);
  return JSON.parse(JSON.stringify(newUser));
};

export const fetchWorkoutLogs = async (filters?: {
  date?: string;
  userId?: string;
}): Promise<WorkoutLog[]> => {
  console.log("Fake API: Fetching workout logs with filters:", filters);
  await simulateDelay(1200);

  const userLogs = mockWorkoutLogs.filter(
    (log) => log.userId === filters?.userId
  );
  return JSON.parse(JSON.stringify(userLogs));
};

export const fetchBodyMetrics = async (
  userId?: string
): Promise<BodyMetric[]> => {
  console.log("Fake API: Fetching body metrics for user:", userId);
  await simulateDelay(1000);
  const userMetrics = mockBodyMetrics.filter((m) => m.userId === userId);
  return JSON.parse(JSON.stringify(userMetrics));
};

export const fetchPrograms = async (userId: string): Promise<Program[]> => {
  console.log("Fake API: Fetching programs for user:", userId);
  await simulateDelay();
  return JSON.parse(
    JSON.stringify(mockPrograms.filter((p) => p.createdBy === userId))
  );
};

export const fetchProgramById = async (
  programId: string
): Promise<Program | undefined> => {
  await simulateDelay();
  return JSON.parse(
    JSON.stringify(mockPrograms.find((p) => p.id === programId))
  );
};

export const fetchMasterExercises = async (
  searchTerm?: string
): Promise<MasterExercise[]> => {
  await simulateDelay(300);
  console.log("Fake API: Fetching master exercises with term:", searchTerm);
  if (!searchTerm) {
    return JSON.parse(JSON.stringify(mockMasterExercises));
  }
  const lowerTerm = searchTerm.toLowerCase();
  const results = mockMasterExercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(lowerTerm) ||
      ex.bodyPart.toLowerCase().includes(lowerTerm) ||
      ex.category.toLowerCase().includes(lowerTerm)
  );
  return JSON.parse(JSON.stringify(results));
};

export const saveWorkoutLog = async (
  logData: Omit<WorkoutLog, "id"> & { id?: string }
): Promise<WorkoutLog> => {
  await simulateDelay();
  if (logData.id) {
    const index = mockWorkoutLogs.findIndex((l) => l.id === logData.id);
    if (index > -1) {
      mockWorkoutLogs[index] = {
        ...mockWorkoutLogs[index],
        ...logData,
      } as WorkoutLog;
      return JSON.parse(JSON.stringify(mockWorkoutLogs[index]));
    }
    throw new Error("Log not found for update");
  } else {
    const newLog = { ...logData, id: generateId("log") } as WorkoutLog;
    mockWorkoutLogs.push(newLog);
    return JSON.parse(JSON.stringify(newLog));
  }
};

export const saveProgram = async (
  programData: Omit<Program, "id" | "createdBy"> & {
    id?: string;
    createdBy?: string;
  }
): Promise<Program> => {
  await simulateDelay();
  if (programData.id) {
    const index = mockPrograms.findIndex((p) => p.id === programData.id);
    if (index > -1) {
      mockPrograms[index] = {
        ...mockPrograms[index],
        ...programData,
        createdBy: mockPrograms[index].createdBy,
      };
      return JSON.parse(JSON.stringify(mockPrograms[index]));
    }
    throw new Error("Program not found");
  } else {
    // Create
    const newProgram = {
      ...programData,
      id: generateId("prog"),
      createdBy: "user-1",
    } as Program; // Assume user-1
    mockPrograms.push(newProgram);
    return JSON.parse(JSON.stringify(newProgram));
  }
};

export const deleteProgram = async (programId: string): Promise<void> => {
  await simulateDelay();
  const initialLength = mockPrograms.length;
  mockPrograms = mockPrograms.filter((p) => p.id !== programId);
  if (mockPrograms.length === initialLength) {
    throw new Error("Program not found for deletion.");
  }
  return;
};

export const saveBodyMetric = async (
  metric: Partial<BodyMetric>
): Promise<BodyMetric> => {
  await simulateDelay();

  const newMetric = { ...metric, id: generateId("bm") } as BodyMetric;
  mockBodyMetrics.push(newMetric);

  mockBodyMetrics.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log(
    "Fake API: Saved new metric. Total metrics now:",
    mockBodyMetrics.length
  );
  return JSON.parse(JSON.stringify(newMetric));
};

export const mockMasterExercises: MasterExercise[] = [
  {
    id: "master_ex_001",
    name: "Barbell Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Barbell", "Rack"],
  },

  {
    id: "master_ex_002",
    name: "Bench Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Barbell", "Bench"],
  },
  {
    id: "master_ex_003",
    name: "Deadlift",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_004",
    name: "Overhead Press",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_005",
    name: "Pull Up",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Pull-up bar", "Bodyweight"],
  },
  {
    id: "master_ex_006",
    name: "Dumbbell Bench Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Dumbbell", "Bench"],
  },
  {
    id: "master_ex_007",
    name: "Dumbbell Row",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Dumbbell", "Bench"],
  },
  {
    id: "master_ex_008",
    name: "Leg Press",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Leg Press Machine"],
  },
  {
    id: "master_ex_009",
    name: "Bicep Curl (Dumbbell)",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_010",
    name: "Tricep Pushdown (Cable)",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Cable Machine"],
  },
  {
    id: "master_ex_011",
    name: "Running (Treadmill)",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Treadmill"],
  },
  {
    id: "master_ex_012",
    name: "Plank",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_013",
    name: "Push-up",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_014",
    name: "Air Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_015",
    name: "Lunges (Forward)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight", "Dumbbell (Optional)"],
  },
  {
    id: "master_ex_016",
    name: "Burpees",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_017",
    name: "Jumping Jacks",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_018",
    name: "Glute Bridge",
    bodyPart: "Glutes",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_019",
    name: "Tricep Dips (Bench/Chair)",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Bench", "Chair"],
  },
  {
    id: "master_ex_020",
    name: "Mountain Climbers",
    bodyPart: "Core",
    category: "Cardio",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_021",
    name: "Crunches",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_022",
    name: "Leg Raises",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_023",
    name: "High Knees",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_024",
    name: "Incline Push-up",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Bodyweight", "Elevated Surface"],
  },
  {
    id: "master_ex_025",
    name: "Decline Push-up",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Bodyweight", "Elevated Surface (Feet)"],
  },
  {
    id: "master_ex_026",
    name: "Pike Push-up",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_027",
    name: "Calf Raises (Bodyweight)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_028",
    name: "Bird Dog",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_029",
    name: "Superman",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_030",
    name: "Jump Squats",
    bodyPart: "Legs",
    category: "Plyometrics",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_031",
    name: "Russian Twists (Bodyweight)",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_032",
    name: "Diamond Push-ups",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_033",
    name: "Side Plank (Left)",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_034",
    name: "Side Plank (Right)",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_035",
    name: "Wall Sit",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight", "Wall"],
  },
  {
    id: "master_ex_036",
    name: "Reverse Lunges",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight", "Dumbbell (Optional)"],
  },
  {
    id: "master_ex_037",
    name: "Single Leg Deadlift (Bodyweight)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_038",
    name: "Flutter Kicks",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_039",
    name: "Incline Dumbbell Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Dumbbell", "Incline Bench"],
  },
  {
    id: "master_ex_040",
    name: "Lat Pulldown (Wide Grip)",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Cable Machine", "Lat Pulldown Bar"],
  },
  {
    id: "master_ex_041",
    name: "Seated Cable Row",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Cable Machine", "Row Handle"],
  },
  {
    id: "master_ex_042",
    name: "Dumbbell Shoulder Press",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Dumbbell", "Bench (Optional)"],
  },
  {
    id: "master_ex_043",
    name: "Lateral Raises (Dumbbell)",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_044",
    name: "Front Raises (Dumbbell)",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_045",
    name: "Romanian Deadlift (RDL)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Barbell", "Dumbbell"],
  },
  {
    id: "master_ex_046",
    name: "Leg Extension",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Leg Extension Machine"],
  },
  {
    id: "master_ex_047",
    name: "Hamstring Curl (Lying or Seated)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Leg Curl Machine"],
  },
  {
    id: "master_ex_048",
    name: "Cable Flyes",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Cable Machine"],
  },
  {
    id: "master_ex_049",
    name: "Face Pulls",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Cable Machine", "Rope Attachment"],
  },
  {
    id: "master_ex_050",
    name: "Barbell Curl",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Barbell", "EZ Bar"],
  },
  {
    id: "master_ex_051",
    name: "Hammer Curls (Dumbbell)",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_052",
    name: "Skullcrushers (EZ Bar)",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["EZ Bar", "Bench"],
  },
  {
    id: "master_ex_053",
    name: "Close-grip Bench Press",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Barbell", "Bench"],
  }, // Triceps focus
  {
    id: "master_ex_054",
    name: "Hack Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Hack Squat Machine"],
  },
  {
    id: "master_ex_055",
    name: "T-Bar Row",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["T-Bar Row Machine", "Barbell + Landmine"],
  },
  {
    id: "master_ex_056",
    name: "Hanging Leg Raises",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Pull-up bar", "Captain's Chair"],
  },
  {
    id: "master_ex_057",
    name: "Cable Crunches",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Cable Machine", "Rope Attachment"],
  },
  {
    id: "master_ex_058",
    name: "Cycling (Stationary Bike)",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Stationary Bike"],
  },
  {
    id: "master_ex_059",
    name: "Elliptical Trainer",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Elliptical Machine"],
  },
  {
    id: "master_ex_060",
    name: "Bulgarian Split Squats",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight", "Dumbbell (Optional)", "Bench"],
  },
  {
    id: "master_ex_061",
    name: "Preacher Curls (Machine or Dumbbell)",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Preacher Curl Bench", "Dumbbell", "EZ Bar"],
  },
  {
    id: "master_ex_062",
    name: "Good Mornings",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_063",
    name: "Box Jumps",
    bodyPart: "Legs",
    category: "Plyometrics",
    equipment: ["Box", "Bodyweight"],
  },
  {
    id: "master_ex_064",
    name: "Kettlebell Swings",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Kettlebell"],
  },
  {
    id: "master_ex_065",
    name: "Goblet Squat (Kettlebell/Dumbbell)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Kettlebell", "Dumbbell"],
  },
  {
    id: "master_ex_066",
    name: "Chin Up (Supinated Grip)",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Pull-up bar", "Bodyweight"],
  },
  {
    id: "master_ex_067",
    name: "Inverted Row / Bodyweight Row",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Bar", "Smith Machine", "Rings", "TRX"],
  },
  {
    id: "master_ex_068",
    name: "Dumbbell Flyes",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Dumbbell", "Bench"],
  },
  {
    id: "master_ex_069",
    name: "Decline Dumbbell Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Dumbbell", "Decline Bench"],
  },
  {
    id: "master_ex_070",
    name: "Seated Dumbbell Shoulder Press",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Dumbbell", "Bench"],
  },
  {
    id: "master_ex_071",
    name: "Arnold Press",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_072",
    name: "Reverse Pec Deck / Rear Delt Fly Machine",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Machine"],
  },
  {
    id: "master_ex_073",
    name: "Barbell Hip Thrusts",
    bodyPart: "Glutes",
    category: "Strength",
    equipment: ["Barbell", "Bench", "Pad"],
  },
  {
    id: "master_ex_074",
    name: "Leg Curls (Standing, Machine)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Leg Curl Machine"],
  },
  {
    id: "master_ex_075",
    name: "Concentration Curls (Dumbbell)",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Dumbbell", "Bench"],
  },
  {
    id: "master_ex_076",
    name: "Overhead Dumbbell Tricep Extension",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_077",
    name: "Rope Climbs",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Rope"],
  },
  {
    id: "master_ex_078",
    name: "Battle Ropes",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Battle Ropes"],
  },
  {
    id: "master_ex_079",
    name: "Box Squats (Barbell)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Barbell", "Box", "Rack"],
  },
  {
    id: "master_ex_080",
    name: "Sled Push",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Sled"],
  },
  {
    id: "master_ex_081",
    name: "Tire Flips",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Tire"],
  },
  {
    id: "master_ex_082",
    name: "Walking Lunges (Bodyweight or Dumbbell)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight", "Dumbbell (Optional)"],
  },
  {
    id: "master_ex_083",
    name: "V-Ups",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_084",
    name: "Hollow Body Hold",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_085",
    name: "Kettlebell Goblet Reverse Lunge",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Kettlebell"],
  },
  {
    id: "master_ex_086",
    name: "Pistol Squats (Single Leg Squat)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_087",
    name: "Handstand Push-ups (Wall Assisted)",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Bodyweight", "Wall"],
  },
  {
    id: "master_ex_088",
    name: "Muscle-ups (Rings or Bar)",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Rings", "Pull-up bar"],
  },
  {
    id: "master_ex_089",
    name: "Chest Stretch (Doorway)",
    bodyPart: "Chest",
    category: "Stretching",
    equipment: ["Doorway"],
  },
  {
    id: "master_ex_090",
    name: "Hamstring Stretch (Standing or Seated)",
    bodyPart: "Legs",
    category: "Stretching",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_091",
    name: "Quad Stretch (Standing)",
    bodyPart: "Legs",
    category: "Stretching",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_092",
    name: "Tricep Stretch (Overhead)",
    bodyPart: "Arms",
    category: "Stretching",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_093",
    name: "Shoulder Stretch (Cross-Body)",
    bodyPart: "Shoulders",
    category: "Stretching",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_094",
    name: "Yoga - Downward Dog",
    bodyPart: "Full Body",
    category: "Stretching",
    equipment: ["Bodyweight", "Yoga Mat (Optional)"],
  },
  {
    id: "master_ex_095",
    name: "Yoga - Cat Cow Pose",
    bodyPart: "Back",
    category: "Stretching",
    equipment: ["Bodyweight", "Yoga Mat (Optional)"],
  },
  {
    id: "master_ex_096",
    name: "Foam Rolling (Various body parts)",
    bodyPart: "Full Body",
    category: "Mobility",
    equipment: ["Foam Roller"],
  },
  {
    id: "master_ex_097",
    name: "Farmer's Walk",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Dumbbell", "Kettlebell", "Farmer's Walk Handles"],
  },
  {
    id: "master_ex_098",
    name: "Stair Climbing",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Stairs", "Stair Climber Machine"],
  },
  {
    id: "master_ex_099",
    name: "Rowing Machine (Erg)",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Rowing Machine"],
  },
  {
    id: "master_ex_100",
    name: "Kettlebell Clean and Press",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Kettlebell"],
  },

  {
    id: "master_ex_101",
    name: "Sumo Deadlift",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_102",
    name: "Smith Machine Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Smith Machine"],
  },
  {
    id: "master_ex_103",
    name: "Goblet Lunge (Dumbbell)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_104",
    name: "Reverse Hyperextension",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Reverse Hyper Machine"],
  },
  {
    id: "master_ex_105",
    name: "Chest Press Machine",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Chest Press Machine"],
  },
  {
    id: "master_ex_106",
    name: "Incline Chest Press Machine",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Incline Chest Press Machine"],
  },
  {
    id: "master_ex_107",
    name: "Seated Leg Curl",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Leg Curl Machine"],
  },
  {
    id: "master_ex_108",
    name: "Seated Leg Press Calf Raise",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Leg Press Machine"],
  },
  {
    id: "master_ex_109",
    name: "Standing Calf Raise Machine",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Calf Raise Machine"],
  },
  {
    id: "master_ex_110",
    name: "Seated Calf Raise",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Seated Calf Raise Machine"],
  },
  {
    id: "master_ex_111",
    name: "Hip Abduction Machine",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Hip Abduction Machine"],
  },
  {
    id: "master_ex_112",
    name: "Hip Adduction Machine",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Hip Adduction Machine"],
  },
  {
    id: "master_ex_113",
    name: "Smith Machine Bench Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Smith Machine", "Bench"],
  },
  {
    id: "master_ex_114",
    name: "Dumbbell Pullover",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Dumbbell", "Bench"],
  },
  {
    id: "master_ex_115",
    name: "Decline Chest Press Machine",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Decline Chest Press Machine"],
  },
  {
    id: "master_ex_116",
    name: "Machine Pec Fly",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Pec Deck Machine"],
  },
  {
    id: "master_ex_117",
    name: "Plate Front Raise",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Weight Plate"],
  },
  {
    id: "master_ex_118",
    name: "Upright Row (Barbell)",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_119",
    name: "Cable Lateral Raise",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Cable Machine", "Handle"],
  },
  {
    id: "master_ex_120",
    name: "Dumbbell Rear Delt Fly",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_121",
    name: "Machine Shoulder Press",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Shoulder Press Machine"],
  },
  {
    id: "master_ex_122",
    name: "Barbell Shrug",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_123",
    name: "Dumbbell Shrug",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_124",
    name: "Farmer Carry (Heavy Dumbbells)",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Dumbbell"],
  },
  {
    id: "master_ex_125",
    name: "Sandbag Carry",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Sandbag"],
  },
  {
    id: "master_ex_126",
    name: "Weighted Vest Run",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Treadmill", "Weighted Vest"],
  },
  {
    id: "master_ex_127",
    name: "Battle Rope Slams",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Battle Ropes"],
  },
  {
    id: "master_ex_128",
    name: "Kettlebell Snatch",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Kettlebell"],
  },
  {
    id: "master_ex_129",
    name: "Kettlebell Windmill",
    bodyPart: "Core",
    category: "Stability",
    equipment: ["Kettlebell"],
  },
  {
    id: "master_ex_130",
    name: "TRX Chest Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["TRX"],
  },
  {
    id: "master_ex_131",
    name: "TRX Row",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["TRX"],
  },
  {
    id: "master_ex_132",
    name: "TRX Pike",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["TRX"],
  },
  {
    id: "master_ex_133",
    name: "TRX Single Leg Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["TRX"],
  },
  {
    id: "master_ex_134",
    name: "Stability Ball Rollout",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Stability Ball"],
  },
  {
    id: "master_ex_135",
    name: "Stability Ball Hamstring Curl",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Stability Ball"],
  },
  {
    id: "master_ex_136",
    name: "Stability Ball Chest Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Stability Ball", "Dumbbell"],
  },
  {
    id: "master_ex_137",
    name: "Medicine Ball Slams",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Medicine Ball"],
  },
  {
    id: "master_ex_138",
    name: "Medicine Ball Russian Twist",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Medicine Ball"],
  },
  {
    id: "master_ex_139",
    name: "Medicine Ball Push-up",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Medicine Ball"],
  },
  {
    id: "master_ex_140",
    name: "Medicine Ball Overhead Throw",
    bodyPart: "Full Body",
    category: "Power",
    equipment: ["Medicine Ball"],
  },
  {
    id: "master_ex_141",
    name: "Resistance Band Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_142",
    name: "Resistance Band Deadlift",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_143",
    name: "Resistance Band Chest Press",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_144",
    name: "Resistance Band ROW",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_145",
    name: "Bosu Ball Push-up",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Bosu Ball"],
  },
  {
    id: "master_ex_146",
    name: "Bosu Ball Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bosu Ball"],
  },
  {
    id: "master_ex_147",
    name: "Bosu Ball Lunge",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bosu Ball"],
  },
  {
    id: "master_ex_148",
    name: "Bosu Ball Plank",
    bodyPart: "Core",
    category: "Stability",
    equipment: ["Bosu Ball"],
  },
  {
    id: "master_ex_149",
    name: "Glute Kickback (Cable)",
    bodyPart: "Glutes",
    category: "Strength",
    equipment: ["Cable Machine", "Ankle Strap"],
  },
  {
    id: "master_ex_150",
    name: "Cable Lunge",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Cable Machine", "Handle"],
  },
  {
    id: "master_ex_151",
    name: "Cable Bulgarian Split Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Cable Machine", "Handle"],
  },
  {
    id: "master_ex_152",
    name: "Cable Kickback",
    bodyPart: "Glutes",
    category: "Strength",
    equipment: ["Cable Machine", "Ankle Strap"],
  },
  {
    id: "master_ex_153",
    name: "Tire Drag",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Tire", "Harness"],
  },
  {
    id: "master_ex_154",
    name: "Tire Jump Overs",
    bodyPart: "Legs",
    category: "Plyometrics",
    equipment: ["Tire"],
  },
  {
    id: "master_ex_155",
    name: "Broad Jump",
    bodyPart: "Legs",
    category: "Plyometrics",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_156",
    name: "Depth Jump",
    bodyPart: "Legs",
    category: "Plyometrics",
    equipment: ["Box"],
  },
  {
    id: "master_ex_157",
    name: "Skater Jumps",
    bodyPart: "Legs",
    category: "Plyometrics",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_158",
    name: "Tuck Jumps",
    bodyPart: "Legs",
    category: "Plyometrics",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_159",
    name: "Plyo Push-up",
    bodyPart: "Chest",
    category: "Plyometrics",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_160",
    name: "Depth Push-up",
    bodyPart: "Chest",
    category: "Plyometrics",
    equipment: ["Stacked Platforms"],
  },
  {
    id: "master_ex_161",
    name: "Speed Skips",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Jump Rope"],
  },
  {
    id: "master_ex_162",
    name: "Boxing Bag Workout",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Punching Bag", "Gloves"],
  },
  {
    id: "master_ex_163",
    name: "Shadow Boxing",
    bodyPart: "Full Body",
    category: "Cardio",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_164",
    name: "Sled Pull",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Sled"],
  },
  {
    id: "master_ex_165",
    name: "Sled Drag",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Sled"],
  },
  {
    id: "master_ex_166",
    name: "Sled Sprints",
    bodyPart: "Legs",
    category: "Cardio",
    equipment: ["Sled"],
  },
  {
    id: "master_ex_167",
    name: "Weighted Step-ups",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Dumbbell", "Step"],
  },
  {
    id: "master_ex_168",
    name: "Box Step-ups (Bodyweight)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Box"],
  },
  {
    id: "master_ex_169",
    name: "Single-Arm Kettlebell Snatch",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Kettlebell"],
  },
  {
    id: "master_ex_170",
    name: "Single-Arm Kettlebell Clean",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Kettlebell"],
  },
  {
    id: "master_ex_171",
    name: "Turkish Get-Up",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Kettlebell"],
  },
  {
    id: "master_ex_172",
    name: "Sandbag Overhead Press",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Sandbag"],
  },
  {
    id: "master_ex_173",
    name: "Sandbag Squat Clean",
    bodyPart: "Full Body",
    category: "Strength",
    equipment: ["Sandbag"],
  },
  {
    id: "master_ex_174",
    name: "Weighted Nordic Hamstring Curl",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Weight Plate"],
  },
  {
    id: "master_ex_175",
    name: "Nordic Hamstring Curl (Bodyweight)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_176",
    name: "Jefferson Deadlift",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_177",
    name: "Zercher Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Barbell"],
  },
  {
    id: "master_ex_178",
    name: "Banded Good Morning",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_179",
    name: "Banded Pull Apart",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_180",
    name: "Banded Face Pull",
    bodyPart: "Shoulders",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_181",
    name: "Banded Tricep Extension",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_182",
    name: "Banded Bicep Curl",
    bodyPart: "Arms",
    category: "Strength",
    equipment: ["Resistance Band"],
  },
  {
    id: "master_ex_183",
    name: "Weighted Russian Twist",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Weight Plate"],
  },
  {
    id: "master_ex_184",
    name: "Dragon Flag",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_185",
    name: "Windshield Wipers",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Pull-up Bar"],
  },
  {
    id: "master_ex_186",
    name: "Dragon Squat (Wide Stance Bodyweight Squat)",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_187",
    name: "Jefferson Curl",
    bodyPart: "Back",
    category: "Mobility",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_188",
    name: "Cossack Squat",
    bodyPart: "Legs",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_189",
    name: "80/20 Plank (Plank with One Arm and One Leg Lifted)",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_190",
    name: "Animal Flow Crab Reach",
    bodyPart: "Full Body",
    category: "Mobility",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_191",
    name: "Animal Flow Scorpion Reach",
    bodyPart: "Core",
    category: "Mobility",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_192",
    name: "Animal Flow Ape Reach",
    bodyPart: "Full Body",
    category: "Mobility",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_193",
    name: "Animal Flow Beast Reach",
    bodyPart: "Full Body",
    category: "Mobility",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_194",
    name: "L-Sit",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Parallettes", "Bodyweight"],
  },
  {
    id: "master_ex_195",
    name: "V-Sit (Tucked)",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_196",
    name: "Rope Pull-up",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Rope"],
  },
  {
    id: "master_ex_197",
    name: "Rope Climb Leg Raise",
    bodyPart: "Core",
    category: "Strength",
    equipment: ["Rope"],
  },
  {
    id: "master_ex_198",
    name: "T-Push-up",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_199",
    name: "Spiderman Push-up",
    bodyPart: "Chest",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
  {
    id: "master_ex_200",
    name: "Arch Hold",
    bodyPart: "Back",
    category: "Strength",
    equipment: ["Bodyweight"],
  },
];
