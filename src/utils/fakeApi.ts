// /src/utils/fakeApi.ts - Mock API for data fetching and mutations.

// --- Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "8-12" or "15"
  restInterval: number; // in seconds
}

export interface Program {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  createdBy: string; // userId
}

export interface WorkoutLog {
  id: string;
  programId: string;
  programTitle: string; // denormalized for convenience
  date: string; // ISO Date string (YYYY-MM-DD)
  durationMinutes?: number; // total duration
  caloriesBurned?: number;
  notes?: string;
  completedExercises: Array<{
    exerciseId: string;
    exerciseName: string; // denormalized
    sets: Array<{
      reps: number | null;
      weight: number | null;
      completed: boolean;
    }>;
  }>;
}

export interface BodyMetric {
  date: string; // ISO Date string
  weightKg?: number;
  bmi?: number;
  bodyFatPercentage?: number;
}

// --- Mock Data Store ---
let mockUsers: User[] = [
  {
    id: "user1",
    name: "Test User",
    email: "test@example.com",
    avatarUrl: "https://via.placeholder.com/150/0000FF/808080?Text=User",
  },
];

let mockPrograms: Program[] = [
  {
    id: "prog1",
    title: "Full Body Strength",
    description: "A balanced full-body workout for strength and muscle gain.",
    exercises: [
      { id: "ex1", name: "Squats", sets: 3, reps: "8-12", restInterval: 60 },
      {
        id: "ex2",
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        restInterval: 60,
      },
      { id: "ex3", name: "Deadlifts", sets: 1, reps: "5", restInterval: 120 },
    ],
    createdBy: "user1",
  },
  {
    id: "prog2",
    title: "Upper Body Hypertrophy",
    description: "Focus on building muscle in the upper body.",
    exercises: [
      {
        id: "ex4",
        name: "Overhead Press",
        sets: 4,
        reps: "10-15",
        restInterval: 45,
      },
      { id: "ex5", name: "Pull Ups", sets: 3, reps: "AMRAP", restInterval: 75 },
    ],
    createdBy: "user1",
  },
];

let mockWorkoutLogs: WorkoutLog[] = [
  {
    id: "log1",
    programId: "prog1",
    programTitle: "Full Body Strength",
    date: "2023-11-15",
    durationMinutes: 60,
    caloriesBurned: 350,
    completedExercises: [
      {
        exerciseId: "ex1",
        exerciseName: "Squats",
        sets: [
          { reps: 10, weight: 100, completed: true },
          { reps: 9, weight: 100, completed: true },
          { reps: 8, weight: 100, completed: true },
        ],
      },
    ],
  },
  {
    id: "log2",
    programId: "prog2",
    programTitle: "Upper Body Hypertrophy",
    date: "2023-11-17",
    durationMinutes: 75,
    caloriesBurned: 400,
    completedExercises: [
      {
        exerciseId: "ex4",
        exerciseName: "Overhead Press",
        sets: [
          { reps: 12, weight: 50, completed: true },
          { reps: 12, weight: 50, completed: true },
          { reps: 10, weight: 50, completed: true },
          { reps: 10, weight: 50, completed: true },
        ],
      },
    ],
  },
];

let mockBodyMetrics: BodyMetric[] = [
  { date: "2023-10-01", weightKg: 75, bmi: 23.4 },
  { date: "2023-10-15", weightKg: 74.5, bmi: 23.2 },
  { date: "2023-11-01", weightKg: 74, bmi: 23.1 },
  { date: "2023-11-15", weightKg: 73.8, bmi: 23.0 },
];

// --- Utility to simulate API delay ---
const simulateDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// --- Auth ---
export const fakeLogin = async (email: string, pass: string): Promise<User> => {
  await simulateDelay();
  const user = mockUsers.find((u) => u.email === email); // In a real app, check password hash
  if (user && pass) {
    // simplified password check
    return user;
  }
  throw new Error("Invalid credentials");
};

export const fakeSignup = async (
  name: string,
  email: string,
  pass: string
): Promise<User> => {
  await simulateDelay();
  if (mockUsers.some((u) => u.email === email)) {
    throw new Error("Email already exists");
  }
  const newUser: User = { id: `user${mockUsers.length + 1}`, name, email }; // password should be hashed
  mockUsers.push(newUser);
  return newUser;
};

export const fakeLogout = async (): Promise<void> => {
  await simulateDelay();
  // No real server-side session to clear for this mock
  return;
};

// --- Programs ---
export const fetchPrograms = async (): Promise<Program[]> => {
  await simulateDelay();
  return [...mockPrograms];
};

export const fetchProgramById = async (
  programId: string
): Promise<Program | undefined> => {
  await simulateDelay();
  return mockPrograms.find((p) => p.id === programId);
};

export const saveProgram = async (
  programData: Omit<Program, "id" | "createdBy"> & { id?: string }
): Promise<Program> => {
  await simulateDelay();
  if (programData.id) {
    // Update existing
    const index = mockPrograms.findIndex((p) => p.id === programData.id);
    if (index > -1) {
      mockPrograms[index] = {
        ...mockPrograms[index],
        ...programData,
        createdBy: mockPrograms[index].createdBy,
      };
      return mockPrograms[index];
    }
    throw new Error("Program not found for update");
  } else {
    // Create new
    const newProgram: Program = {
      ...programData,
      id: `prog${mockPrograms.length + Date.now()}`,
      createdBy: "user1", // Assume current user
    };
    mockPrograms.push(newProgram);
    return newProgram;
  }
};

// --- Workout Logs ---
export const fetchWorkoutLogs = async (filters?: {
  date?: string;
  programId?: string;
}): Promise<WorkoutLog[]> => {
  await simulateDelay();
  let logs = [...mockWorkoutLogs];
  if (filters?.date) {
    logs = logs.filter((log) => log.date === filters.date);
  }
  if (filters?.programId) {
    logs = logs.filter((log) => log.programId === filters.programId);
  }
  return logs;
};

export const fetchWorkoutLogById = async (
  logId: string
): Promise<WorkoutLog | undefined> => {
  await simulateDelay();
  return mockWorkoutLogs.find((l) => l.id === logId);
};

export const saveWorkoutLog = async (
  logData: Omit<WorkoutLog, "id"> & { id?: string }
): Promise<WorkoutLog> => {
  await simulateDelay();
  if (logData.id) {
    const index = mockWorkoutLogs.findIndex((l) => l.id === logData.id);
    if (index > -1) {
      mockWorkoutLogs[index] = { ...mockWorkoutLogs[index], ...logData };
      return mockWorkoutLogs[index];
    }
    throw new Error("Workout log not found for update");
  } else {
    const newLog: WorkoutLog = {
      ...logData,
      id: `log${mockWorkoutLogs.length + Date.now()}`,
    };
    mockWorkoutLogs.push(newLog);
    return newLog;
  }
};

// --- Body Metrics ---
export const fetchBodyMetrics = async (): Promise<BodyMetric[]> => {
  await simulateDelay();
  return [...mockBodyMetrics].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const saveBodyMetric = async (
  metricData: Omit<BodyMetric, "date"> & { date: string }
): Promise<BodyMetric> => {
  await simulateDelay();
  const index = mockBodyMetrics.findIndex((m) => m.date === metricData.date);
  if (index > -1) {
    mockBodyMetrics[index] = { ...mockBodyMetrics[index], ...metricData };
    return mockBodyMetrics[index];
  } else {
    const newMetric: BodyMetric = { ...metricData };
    mockBodyMetrics.push(newMetric);
    // Re-sort by date
    mockBodyMetrics.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return newMetric;
  }
};

// Add other mock API functions for exercises, history, analytics data, user profile, etc.
