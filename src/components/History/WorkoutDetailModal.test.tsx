import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import WorkoutDetailModal from "./WorkoutDetailModal";
import { WorkoutLog } from "../../types/data";

const mockLog: WorkoutLog = {
  id: "log1",
  userId: "user1",
  date: "2024-05-21T10:00:00.000Z",
  programId: "prog1",
  programTitle: "Full Body Blast",
  durationMinutes: 60,
  caloriesBurned: 500,
  notes: "Felt strong today, increased weight on squats.",
  completedExercises: [
    {
      exerciseId: "ex1",
      exerciseName: "Squats",
      sets: [
        { reps: 10, weight: 100, completed: true },
        { reps: 10, weight: 100, completed: true },
        { reps: 8, weight: 100, completed: false },
      ],
    },
    {
      exerciseId: "ex2",
      exerciseName: "Bench Press",
      sets: [
        { reps: 12, weight: 80, completed: true },
        { reps: 12, weight: 80, completed: true },
        { reps: 10, weight: 80, completed: true },
      ],
    },
  ],
};

describe("WorkoutDetailModal", () => {
  it("should not render when isOpen is false", () => {
    render(
      <WorkoutDetailModal isOpen={false} onClose={() => {}} log={mockLog} />
    );
    expect(screen.queryByText("Workout Details")).not.toBeInTheDocument();
  });

  it("should render correctly with all data when isOpen is true", () => {
    const handleClose = jest.fn();
    render(
      <WorkoutDetailModal isOpen={true} onClose={handleClose} log={mockLog} />
    );

    // Check title and date
    expect(screen.getByText("Workout Details")).toBeInTheDocument();
    expect(screen.getByText("Full Body Blast")).toBeInTheDocument();
    expect(screen.getByText("Tuesday, May 21, 2024")).toBeInTheDocument();

    // Check stats
    expect(screen.getByText("60 min")).toBeInTheDocument();
    expect(screen.getByText("500 kcal")).toBeInTheDocument();

    // Check exercises
    expect(screen.getByText("Squats")).toBeInTheDocument();
    expect(screen.getByText("2/3 sets")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("3/3 sets")).toBeInTheDocument();

    // Check notes
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(
      screen.getByText("Felt strong today, increased weight on squats.")
    ).toBeInTheDocument();
  });

  it("should handle missing optional data gracefully", () => {
    const logWithoutOptionalData: WorkoutLog = {
      ...mockLog,
      notes: undefined,
      caloriesBurned: undefined,
    };
    render(
      <WorkoutDetailModal
        isOpen={true}
        onClose={() => {}}
        log={logWithoutOptionalData}
      />
    );

    expect(screen.queryByText("Notes")).not.toBeInTheDocument();
    expect(screen.queryByText("kcal")).not.toBeInTheDocument();
    expect(screen.getByText("60 min")).toBeInTheDocument(); // Duration should still be there
  });

  it("should display a message when there are no completed exercises", () => {
    const logWithoutExercises: WorkoutLog = {
      ...mockLog,
      completedExercises: [],
    };
    render(
      <WorkoutDetailModal
        isOpen={true}
        onClose={() => {}}
        log={logWithoutExercises}
      />
    );

    expect(
      screen.getByText("No specific exercises were tracked for this session.")
    ).toBeInTheDocument();
  });

  it("should call onClose when the modal's close button is clicked", () => {
    const handleClose = jest.fn();
    render(
      <WorkoutDetailModal isOpen={true} onClose={handleClose} log={mockLog} />
    );

    // The Modal component itself has a close button, let's assume it has a role of 'button' and an accessible name like 'Close'
    // This is a more robust way to find the close button. We are targeting the button inside the Modal component.
    const closeButton = screen.getByRole("button", { name: /Close modal/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
