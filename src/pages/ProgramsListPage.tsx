// /src/pages/ProgramsListPage.tsx (Corrected)
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  Program,
  fetchPrograms,
  deleteProgram as apiDeleteProgram,
} from "../utils/API";
import ProgramCard from "../components/Programs/ProgramCard";
import Button from "../components/UI/Button";
import ProgramEditorForm from "../components/Programs/ProgramEditorForm";
import Modal from "../components/UI/Modal";
import {
  PlusCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Spinner from "../components/UI/Spinner";

const ProgramsListPage: React.FC = () => {
  const { user } = useAuth(); // <<< FIX: Get the authenticated user
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // State for Delete Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // <<< FIX: Wrap the data loading logic in useCallback for stability >>>
  const loadPrograms = useCallback(() => {
    // Guard against running before user is loaded
    if (!user) return;

    setIsLoading(true);
    fetchPrograms(user.id) // <<< FIX: Pass the required userId
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]); // This function is recreated only when the user object changes

  // <<< FIX: The effect now correctly depends on the stable loadPrograms function >>>
  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const handleOpenModalForNew = () => {
    setEditingProgram(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenModalForEdit = (programId: string) => {
    const programToEdit = programs.find((p) => p.id === programId);
    if (programToEdit) {
      setEditingProgram(programToEdit);
      setIsEditorModalOpen(true);
    }
  };

  const handleCloseEditorModal = () => {
    setIsEditorModalOpen(false);
    setEditingProgram(null);
  };

  const handleSaveProgram = (savedProgram: Program) => {
    if (editingProgram) {
      setPrograms((prev) =>
        prev.map((p) => (p.id === savedProgram.id ? savedProgram : p))
      );
    } else {
      setPrograms((prev) => [savedProgram, ...prev]);
    }
    handleCloseEditorModal();
  };

  // Delete Program Handlers (No changes needed here)
  const handleOpenDeleteModal = (programId: string, programTitle: string) => {
    setProgramToDelete({ id: programId, title: programTitle });
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProgramToDelete(null);
    setDeleteError(null);
  };

  const handleConfirmDeleteProgram = async () => {
    if (!programToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await apiDeleteProgram(programToDelete.id);
      setPrograms((prev) => prev.filter((p) => p.id !== programToDelete.id));
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete program:", error);
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Could not delete program. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // No changes to variants or JSX rendering below this line
  const programsGridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const contentWrapperVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (isLoading && programs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-10 text-brand-text">
        <Spinner size="lg" className="mb-3" /> <p>Loading your programs...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="py-6 sm:py-8"
      initial="initial"
      animate="animate"
      variants={contentWrapperVariants}
    >
      <div className="bg-brand-card rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text mb-4 sm:mb-0">
            Your Workout Programs
          </h1>
          <Button
            variant="primary"
            onClick={handleOpenModalForNew}
            leftIcon={<PlusCircleIcon className="h-5 w-5" />}
            size="md"
          >
            Create Program
          </Button>
        </header>

        <AnimatePresence mode="wait">
          {programs.length > 0 ? (
            <motion.div
              key="programs-grid"
              variants={programsGridVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6"
            >
              {programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onEditClick={handleOpenModalForEdit}
                  onDeleteClick={handleOpenDeleteModal}
                />
              ))}
            </motion.div>
          ) : (
            !isLoading && (
              <motion.div
                key="no-programs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-12 sm:py-16"
              >
                <h2 className="text-xl font-semibold text-brand-text mb-2">
                  No Workout Programs Found
                </h2>
                <p className="text-sm text-brand-text-muted max-w-sm mx-auto mb-6">
                  Start by creating a new program tailored to your fitness
                  goals.
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {isEditorModalOpen && (
        <Modal
          isOpen={isEditorModalOpen}
          onClose={handleCloseEditorModal}
          title={editingProgram ? "Edit Program" : "Create New Workout Program"}
          size="4xl"
          hideDefaultFooter
          panelClassName="dark:bg-[rgb(var(--color-card-rgb)/0.95)] backdrop-blur-lg"
          preventCloseOnBackdropClick={true}
        >
          <ProgramEditorForm
            program={editingProgram}
            onSave={handleSaveProgram}
            onCancel={handleCloseEditorModal}
          />
        </Modal>
      )}

      {isDeleteModalOpen && programToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Confirm Deletion"
          size="md"
          panelClassName="dark:bg-[rgb(var(--color-card-rgb)/0.95)] backdrop-blur-lg"
          preventCloseOnBackdropClick={true}
          hideDefaultFooter={true}
          customFooter={
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                onClick={handleConfirmDeleteProgram}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                Delete Program
              </Button>
            </div>
          }
        >
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-10 w-10 text-error mr-4 flex-shrink-0" />
            <div>
              <p className="text-brand-text">
                Are you sure you want to delete the program:{" "}
                <strong className="text-brand-text font-semibold">
                  "{programToDelete.title}"
                </strong>
                ?
              </p>
              <p className="text-sm text-brand-text-muted mt-2">
                This action cannot be undone.
              </p>
              {deleteError && (
                <p className="text-xs text-error mt-3 bg-error/10 p-2 rounded-md">
                  {deleteError}
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default ProgramsListPage;
