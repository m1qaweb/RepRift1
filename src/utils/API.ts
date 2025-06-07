// /src/utils/Api.ts

import mockMasterExercises from "../assets/data/master-exercises.json";

// --- INTERFACES (No changes needed) ---

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

// --- ARCHITECTURAL UPGRADE: MOCK DATA PERSISTENCE LAYER ---

/**
 * A generic helper function to read from localStorage. If data exists, it's used.
 * If not, it initializes localStorage with the provided default "seed" data.
 * This simulates a persistent database for the browser session.
 */
function initializeMockData<T>(storageKey: string, initialData: T[]): T[] {
  try {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(initialData));
      return initialData;
    }
  } catch (error) {
    console.error(
      `Failed to initialize mock data from localStorage ('${storageKey}'):`,
      error
    );
    return initialData; // Fallback to non-persistent initial data on error
  }
}

// Define unique keys for localStorage to avoid conflicts
const LOCAL_STORAGE_KEYS = {
  USERS: "fitnessApp.mock.users",
  PROGRAMS: "fitnessApp.mock.programs",
  BODY_METRICS: "fitnessApp.mock.bodyMetrics",
  WORKOUT_LOGS: "fitnessApp.mock.workoutLogs",
};

// --- DEFAULT SEED DATA (Used only for first-time initialization) ---

const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Taylor",
    email: "test@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    bio: "Fitness enthusiast focused on strength training and progressive overload.",
    heightCm: 180,
    goals: { weightKg: 80 },
    initialSetupCompleted: true,
  },
];

const defaultPrograms: Program[] = [
  {
    id: "prog-1",
    createdBy: "user-1",
    title: "Classic Push Day",
    description: "hey",
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
    description: "hey",
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

const defaultBodyMetrics: BodyMetric[] = [
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

const defaultWorkoutLogs: WorkoutLog[] = [
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

// --- "LIVE" MOCK DATABASE (Initialized from localStorage) ---

let mockUsers: User[] = initializeMockData(
  LOCAL_STORAGE_KEYS.USERS,
  defaultUsers
);
let mockPrograms: Program[] = initializeMockData(
  LOCAL_STORAGE_KEYS.PROGRAMS,
  defaultPrograms
);
let mockBodyMetrics: BodyMetric[] = initializeMockData(
  LOCAL_STORAGE_KEYS.BODY_METRICS,
  defaultBodyMetrics
);
let mockWorkoutLogs: WorkoutLog[] = initializeMockData(
  LOCAL_STORAGE_KEYS.WORKOUT_LOGS,
  defaultWorkoutLogs
);

// --- UTILITIES ---

let nextId = Date.now(); // Using timestamp for better uniqueness across reloads
const generateId = (prefix: string) => `${prefix}-${nextId++}`;

const simulateDelay = (ms: number = 500) =>
  new Promise((res) => setTimeout(res, ms));

// --- API FUNCTIONS (Now with persistence) ---

export const fakeLogin = async (email: string, pass: string): Promise<User> => {
  await simulateDelay();
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (user && pass) {
    // Simple password check for mock
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
  if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
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
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(mockUsers)); // PERSIST
  return JSON.parse(JSON.stringify(newUser));
};

export const fetchWorkoutLogs = async (filters?: {
  date?: string;
  userId?: string;
}): Promise<WorkoutLog[]> => {
  await simulateDelay(1000);
  const userLogs = mockWorkoutLogs.filter(
    (log) => log.userId === filters?.userId
  );
  return JSON.parse(JSON.stringify(userLogs));
};

export const fetchBodyMetrics = async (
  userId?: string
): Promise<BodyMetric[]> => {
  await simulateDelay(800);
  const userMetrics = mockBodyMetrics.filter((m) => m.userId === userId);
  return JSON.parse(JSON.stringify(userMetrics));
};

export const fetchPrograms = async (userId: string): Promise<Program[]> => {
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
  const masterList = JSON.parse(JSON.stringify(mockMasterExercises));
  if (!searchTerm) {
    return masterList;
  }
  const lowerTerm = searchTerm.toLowerCase();
  return masterList.filter(
    (ex: MasterExercise) =>
      ex.name.toLowerCase().includes(lowerTerm) ||
      ex.bodyPart.toLowerCase().includes(lowerTerm) ||
      ex.category.toLowerCase().includes(lowerTerm)
  );
};

export const saveWorkoutLog = async (
  logData: Omit<WorkoutLog, "id"> & { id?: string }
): Promise<WorkoutLog> => {
  await simulateDelay();
  let savedLog: WorkoutLog;
  if (logData.id) {
    const index = mockWorkoutLogs.findIndex((l) => l.id === logData.id);
    if (index > -1) {
      mockWorkoutLogs[index] = {
        ...mockWorkoutLogs[index],
        ...logData,
      } as WorkoutLog;
      savedLog = mockWorkoutLogs[index];
    } else {
      throw new Error("Log not found for update");
    }
  } else {
    savedLog = { ...logData, id: generateId("log") } as WorkoutLog;
    mockWorkoutLogs.push(savedLog);
  }
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.WORKOUT_LOGS,
    JSON.stringify(mockWorkoutLogs)
  ); // PERSIST
  return JSON.parse(JSON.stringify(savedLog));
};

export const saveProgram = async (
  programData: Omit<Program, "id" | "createdBy"> & {
    id?: string;
    createdBy?: string;
  }
): Promise<Program> => {
  await simulateDelay();
  let savedProgram: Program;
  if (programData.id) {
    const index = mockPrograms.findIndex((p) => p.id === programData.id);
    if (index > -1) {
      mockPrograms[index] = {
        ...mockPrograms[index],
        ...programData,
        createdBy: mockPrograms[index].createdBy, // Ensure original creator is preserved
      };
      savedProgram = mockPrograms[index];
    } else {
      throw new Error("Program not found for update");
    }
  } else {
    savedProgram = {
      ...programData,
      id: generateId("prog"),
      createdBy: "user-1", // Assume current user
    } as Program;
    mockPrograms.push(savedProgram);
  }
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.PROGRAMS,
    JSON.stringify(mockPrograms)
  ); // PERSIST
  return JSON.parse(JSON.stringify(savedProgram));
};

export const deleteProgram = async (programId: string): Promise<void> => {
  await simulateDelay();
  const initialLength = mockPrograms.length;
  mockPrograms = mockPrograms.filter((p) => p.id !== programId);
  if (mockPrograms.length === initialLength) {
    throw new Error("Program not found for deletion.");
  }
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.PROGRAMS,
    JSON.stringify(mockPrograms)
  ); // PERSIST
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

  // Persist the entire updated and sorted array back to localStorage
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.BODY_METRICS,
    JSON.stringify(mockBodyMetrics)
  ); // PERSIST

  return JSON.parse(JSON.stringify(newMetric));
};
