import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Turns retries off for testing
        retry: false,
      },
    },
  });

  render(
    <MemoryRouter initialEntries={["/programs"]}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("Program Creation Flow", () => {
  it("should allow a user to create a new program and see it in the list", async () => {
    renderApp();

    // 1. Verify the initial program from our mock handler is present
    expect(await screen.findByText("Initial Test Program")).toBeInTheDocument();

    // 2. Click the "Create Program" button
    const createButton = screen.getByRole("button", {
      name: /create new program/i,
    });
    userEvent.click(createButton);

    // 3. Fill out the form
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const newProgramTitle = "My New Workout Program";
    const newProgramDesc = "A challenging new routine.";

    await userEvent.type(titleInput, newProgramTitle);
    await userEvent.type(descriptionInput, newProgramDesc);

    // 4. Save the new program
    const saveButton = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveButton);

    // 5. Verify the new program appears in the list.
    // We use `waitFor` because the list will refetch and re-render.
    await waitFor(() => {
      expect(screen.getByText(newProgramTitle)).toBeInTheDocument();
    });
  });
});
