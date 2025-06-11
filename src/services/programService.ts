// /src/services/programService.ts

import { supabase } from "../supabaseClient";
// We re-use the TypeScript interfaces from your API.ts file. This is great practice.
// No need to define what a "Program" is twice!
import { Program, ProgramTemplate } from "../types/data";

/**
 * --- READ ---
 * Fetches all programs for the currently logged-in user.
 *
 * You'll notice we DON'T need to pass the user's ID here. The Row Level
 * Security policy we created in the database does this for us automatically
 * on the backend. It's more secure and simpler.
 */
export const getPrograms = async (): Promise<Program[]> => {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false }); // Show newest programs first

  if (error) {
    console.error("Error fetching programs:", error.message);
    throw error;
  }

  // The 'data' from Supabase should already match our Program interface.
  // We use snake_case in the DB (e.g., created_by) but Supabase can return camelCase.
  // If not, you can map it. For now, we assume it matches.
  // Let's explicitly rename `created_by` to match the `Program` interface.
  const mappedData = data.map((program) => ({
    ...program,
    createdBy: program.created_by,
  })) as Program[];

  return mappedData || [];
};

/**
 * --- CREATE or UPDATE ---
 * Saves a new program or updates an existing one. This one function handles both cases.
 *
 * @param programData - The program object. If it has an 'id', we will update.
 *                      If it doesn't have an 'id', we will create.
 */
export const saveProgram = async (
  programData: Omit<Program, "id" | "createdBy"> & { id?: string }
): Promise<Program> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to save a program.");
  }

  // This is the data object that we will send to the Supabase database.
  // It only contains fields that match our 'programs' table columns.
  const programRow = {
    title: programData.title,
    description: programData.description,
    exercises: programData.exercises,
  };

  let savedProgramData: any; // Using 'any' to handle the response before mapping
  let error;

  if (programData.id) {
    // --- UPDATE an existing program ---
    // The `.eq()` finds the row where 'id' matches.
    const { data, error: updateError } = await supabase
      .from("programs")
      .update(programRow)
      .eq("id", programData.id)
      .select()
      .single(); // `.select().single()` tells Supabase to return the updated row.

    savedProgramData = data;
    error = updateError;
  } else {
    // --- CREATE a new program ---
    // We add the 'created_by' field here, linking the new program to the logged-in user.
    const { data, error: createError } = await supabase
      .from("programs")
      .insert({ ...programRow, created_by: user.id })
      .select()
      .single(); // Return the newly created row, which now has an `id`.

    savedProgramData = data;
    error = createError;
  }

  if (error) {
    console.error("Error saving program:", error.message);
    throw error;
  }
  if (!savedProgramData) {
    throw new Error("Save operation failed to return the program data.");
  }

  // Map the database response (snake_case) to our frontend Program interface (camelCase)
  const finalProgram: Program = {
    ...savedProgramData,
    createdBy: savedProgramData.created_by,
  };

  return finalProgram;
};

export const getProgramById = async (
  programId: string
): Promise<Program | null> => {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId) // Find the row where 'id' matches
    .single(); // Tell Supabase we only expect ONE result

  if (error) {
    // It's common for a program to not be found. Supabase returns a 'PGRST116' error code
    // for this. We should not throw an error in this case, just return null.
    if (error.code !== "PGRST116") {
      console.error("Error fetching program by ID:", error.message);
      throw error;
    }
  }

  if (!data) return null;

  // Map the snake_case `created_by` to our frontend's camelCase `createdBy`
  return {
    ...data,
    createdBy: data.created_by,
  } as Program;
};

/**
 * --- DELETE ---
 * Deletes a program by its unique ID.
 * @param programId - The ID of the program to delete.
 */
export const deleteProgram = async (programId: string): Promise<void> => {
  // Again, RLS on the backend ensures a user can ONLY delete their own programs.
  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId); // Finds the row to delete by its 'id'.

  if (error) {
    console.error("Error deleting program:", error.message);
    throw error;
  }

  // No need to return anything on success.
};

// =========================
// === PROGRAM TEMPLATES ===
// =========================

/**
 * Fetch all program templates. These are read-only.
 */
export const getProgramTemplates = async (): Promise<ProgramTemplate[]> => {
  const { data, error } = await supabase
    .from("program_templates")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching program templates:", error.message);
    throw error;
  }

  return (data ?? []) as ProgramTemplate[];
};

/**
 * Import (duplicate) a template into the user's own programs list.
 * @param templateId UUID of the template to copy.
 */
export const importProgramFromTemplate = async (
  templateId: string
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to import a template.");
  }

  // Fetch the template row
  const { data: template, error: fetchError } = await supabase
    .from("program_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (fetchError) {
    console.error("Error fetching template:", fetchError.message);
    throw fetchError;
  }
  if (!template) {
    throw new Error("Template not found.");
  }

  // Insert a new program for this user based on the template
  const { error: insertError } = await supabase.from("programs").insert({
    title: template.title,
    description: template.description,
    exercises: template.exercises,
    created_by: user.id,
  });

  if (insertError) {
    console.error("Error importing template:", insertError.message);
    throw insertError;
  }
};
