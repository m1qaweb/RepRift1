import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rest } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom";

import ProgramsListPage from "./ProgramsListPage";
import { AuthContext, AuthContextType } from "../contexts/AuthContext";
import { Program } from "../types/data";

// Mock data
let mockPrograms: Program[] = [
  {
    id: "1",
    createdBy: "user-123",
    title: "Full Body Strength",
    description: "A comprehensive workout for all major muscle groups.",
    exercises: [],
  },
  {
    id: "2",
    createdBy: "user-123",
    title: "Cardio Blast",
    description: "High-intensity cardio to improve endurance.",
    exercises: [],
  },
];

// Mock server setup
const server = setupServer(
  rest.get("*/rest/v1/programs", (req, res, ctx) => {
    return res(ctx.json(mockPrograms));
  }),
  rest.delete("*/rest/v1/programs", (req, res, ctx) => {
    const programId = req.url.searchParams.get("id")?.replace("eq.", "");
    if (programId) {
      mockPrograms = mockPrograms.filter((p) => p.id !== programId);
    }
    // With msw v1, it's good practice to return a response for delete
    return res(ctx.status(200), ctx.json({}));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  // Reset mock data after each test
  mockPrograms = [
    {
      id: "1",
      createdBy: "user-123",
      title: "Full Body Strength",
      description: "A comprehensive workout for all major muscle groups.",
      exercises: [],
    },
    {
      id: "2",
      createdBy: "user-123",
      title: "Cardio Blast",
      description: "High-intensity cardio to improve endurance.",
      exercises: [],
    },
  ];
});
afterAll(() => server.close());

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Prevent retries in tests
        cacheTime: 0,
      },
    },
  });

const mockAuthContext: AuthContextType = {
  user: {
    id: "user-123",
    email: "test@example.com",
    initialSetupCompleted: true,
  },
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  updateUser: jest.fn(),
  changePassword: jest.fn(),
};

const renderComponent = (queryClient: QueryClient) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <ProgramsListPage />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("ProgramsListPage", () => {
  test("shows a loading state initially", () => {
    const queryClient = createTestQueryClient();
    renderComponent(queryClient);
    expect(screen.getByText(/loading your programs/i)).toBeInTheDocument();
  });

  test("displays programs after successful fetch", async () => {
    const queryClient = createTestQueryClient();
    renderComponent(queryClient);

    await waitFor(() => {
      expect(screen.getByText("Full Body Strength")).toBeInTheDocument();
    });
    expect(screen.getByText("Cardio Blast")).toBeInTheDocument();
  });

  test("displays an error message on fetch failure", async () => {
    server.use(
      rest.get("*/rest/v1/programs", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );

    const queryClient = createTestQueryClient();
    renderComponent(queryClient);

    await waitFor(() => {
      expect(screen.getByText(/error loading programs/i)).toBeInTheDocument();
    });
  });

  test("displays an empty state message when no programs are found", async () => {
    server.use(
      rest.get("*/rest/v1/programs", (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    const queryClient = createTestQueryClient();
    renderComponent(queryClient);

    await waitFor(() => {
      expect(
        screen.getByText(/your program library is empty/i)
      ).toBeInTheDocument();
    });
  });

  test("opens the create program modal when 'Create New Program' is clicked", async () => {
    const queryClient = createTestQueryClient();
    renderComponent(queryClient);

    await waitFor(() => {
      expect(screen.getByText("Full Body Strength")).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByRole("button", { name: /create new program/i })
    );

    expect(
      await screen.findByText(/create new workout program/i)
    ).toBeInTheDocument();
  });

  test("allows deleting a program", async () => {
    const queryClient = createTestQueryClient();
    renderComponent(queryClient);

    // Wait for initial programs to load
    await screen.findByText("Full Body Strength");

    // Click the delete button for the specific program
    const deleteButton = screen.getByRole("button", {
      name: /delete program: Full Body Strength/i,
    });
    userEvent.click(deleteButton);

    // Check for confirmation modal
    expect(await screen.findByText(/confirm deletion/i)).toBeInTheDocument();

    // Find the button in the modal. It's named 'Confirm Delete' in the component.
    const confirmButton = screen.getByRole("button", {
      name: "Confirm Delete",
    });
    userEvent.click(confirmButton);

    // The modal should close and the program should be gone.
    // We also need to invalidate the query which the component does. The mock server will then return the updated list.
    await waitFor(() => {
      expect(screen.queryByText("Full Body Strength")).not.toBeInTheDocument();
    });

    // Check that other program still exists
    expect(screen.getByText("Cardio Blast")).toBeInTheDocument();
  });
});
