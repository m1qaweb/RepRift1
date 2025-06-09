// /src/pages/ProgramsListPage.tsx (UPGRADED FOR SUPABASE)

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
// === CHANGE 1: Import from our new service layer ===
import { Program } from "../types/data"; // The 'Program' type definition is still useful
import { getPrograms, deleteProgram } from "../services/programService"; // Import our new functions
// === END CHANGE ===
import ProgramCard from "../components/Programs/ProgramCard";
import Button from "../components/UI/Button";
import ProgramEditorForm from "../components/Programs/ProgramEditorForm";
import Modal from "../components/UI/Modal";
import {
  PlusCircleIcon,
  ExclamationTriangleIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Spinner from "../components/UI/Spinner";

const ProgramsListPage: React.FC = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // State for Delete Confirmation (No changes needed here)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadPrograms = useCallback(() => {
    // This guard is still important! Don't fetch if the user isn't logged in.
    if (!user) return;

    setIsLoading(true);
    // === CHANGE 2: Call the new service function ===
    // Note that we no longer need to pass `user.id`. Our RLS policy on the
    // database handles this securely on the backend!
    getPrograms()
      // === END CHANGE ===
      .then(setPrograms)
      .catch((err) => {
        console.error("Failed to load programs:", err);
        // Optionally set an error state here to show a message to the user
      })
      .finally(() => setIsLoading(false));
  }, [user]);

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
      // === CHANGE 3: Call the new delete function from our service ===
      await deleteProgram(programToDelete.id);
      // === END CHANGE ===

      setPrograms((prev) => prev.filter((p) => p.id !== programToDelete.id));
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete program:", error);
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete program."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const programsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const contentWrapperVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
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
      className="container mx-auto px-4 py-6 sm:py-10"
      initial="initial"
      animate="animate"
      variants={contentWrapperVariants}
    >
      <header className="text-center sm:text-left mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-text tracking-tight">
          <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            Workout Programs
          </span>
        </h1>
        <p className="mt-2 sm:mt-3 text-base sm:text-lg text-brand-text-muted max-w-2xl mx-auto sm:mx-0">
          Curate and manage your training routines.
        </p>
      </header>

      <div className="mb-8 flex justify-center sm:justify-end">
        <Button
          variant="primary"
          onClick={handleOpenModalForNew}
          leftIcon={<PlusCircleIcon className="h-5 w-5" />}
          size="md"
          className="shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Create New Program
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {programs.length > 0 ? (
          <motion.div
            key="programs-grid"
            variants={programsGridVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
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
              className="text-center py-16 sm:py-20 px-4 bg-brand-card/30 rounded-2xl border border-brand-border/10"
            >
              <RectangleStackIcon className="h-16 w-16 mx-auto text-brand-primary/20 mb-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text mb-2">
                Your Program Library is Empty
              </h2>
              <p className="text-sm sm:text-base text-brand-text-muted max-w-md mx-auto mb-7">
                Create your first program to get started. It's the first step
                towards a more structured workout plan.
              </p>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {isEditorModalOpen && (
        <Modal
          isOpen={isEditorModalOpen}
          onClose={handleCloseEditorModal}
          title={editingProgram ? "Edit Program" : "Create New Workout Program"}
          size="4xl"
          hideDefaultFooter
          panelClassName="dark:bg-brand-card/80 bg-brand-card-light/95 backdrop-blur-xl"
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
          panelClassName="dark:bg-brand-card/80 bg-brand-card-light/95 backdrop-blur-xl border border-brand-border/20"
          preventCloseOnBackdropClick={true}
          hideDefaultFooter={true}
          customFooter={
            <div className="flex justify-end gap-3 p-4 bg-brand-background/50 rounded-b-lg">
              <Button
                variant="ghost"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDeleteProgram}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                Delete Program
              </Button>
            </div>
          }
        >
          <div className="p-4 flex items-start">
            <ExclamationTriangleIcon className="h-12 w-12 text-error mr-4 flex-shrink-0" />
            <div className="pt-1">
              <p className="text-brand-text">
                Are you sure you want to delete the program:{" "}
                <strong className="text-brand-text font-semibold">
                  "{programToDelete.title}"
                </strong>
                ?
              </p>
              <p className="text-sm text-brand-text-muted mt-2">
                This action is permanent and cannot be undone.
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
