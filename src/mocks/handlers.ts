// src/mocks/handlers.ts
import { rest } from "msw";
import { Program } from "../types/data";

// In-memory "database"
let programs: Program[] = [
  {
    id: "prog1",
    title: "Initial Test Program",
    description: "This is a program that exists when the test starts.",
    exercises: [],
    createdBy: "user1",
  },
];

const API_URL = "*/rest/v1/programs";

export const handlers = [
  // Handles GET requests to fetch programs
  rest.get(API_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(programs));
  }),

  // Handles POST requests to create a new program
  rest.post(API_URL, (req, res, ctx) => {
    const newProgram = req.body as Omit<Program, "id">;

    const createdProgram: Program = {
      id: `prog${Date.now()}`,
      ...newProgram,
    };

    programs.push(createdProgram);

    // Supabase returns an array with the single created item
    return res(ctx.status(201), ctx.json([createdProgram]));
  }),
];

// Utility to reset the database between tests
export const resetDb = () => {
  programs = [
    {
      id: "prog1",
      title: "Initial Test Program",
      description: "This is a program that exists when the test starts.",
      exercises: [],
      createdBy: "user1",
    },
  ];
};
