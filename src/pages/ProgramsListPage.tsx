// /src/pages/ProgramsListPage.tsx (UPGRADED FOR REACT QUERY)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Program } from "../types/data";
import {
  getPrograms,
  deleteProgram,
  saveProgram,
} from "../services/programService";
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
  const queryClient = useQueryClient();

  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const {
    data: programs = [],
    isLoading,
    isError,
    error,
  } = useQuery<Program[], Error>({
    queryKey: ["programs"],
    queryFn: getPrograms,
  });

  const deleteProgramMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      handleCloseDeleteModal();
    },
  });

  const saveProgramMutation = useMutation({
    mutationFn: (
      programData: Omit<Program, "id" | "createdBy"> & { id?: string }
    ) => saveProgram(programData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      handleCloseEditorModal();
    },
  });

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

  const handleSaveProgram = (
    programData: Omit<Program, "id" | "createdBy"> & { id?: string }
  ) => {
    saveProgramMutation.mutate(programData);
  };

  const handleOpenDeleteModal = (programId: string, programTitle: string) => {
    setProgramToDelete({ id: programId, title: programTitle });
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProgramToDelete(null);
  };

  const handleConfirmDeleteProgram = () => {
    if (!programToDelete) return;
    deleteProgramMutation.mutate(programToDelete.id);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-10 text-brand-text">
        <Spinner size="lg" className="mb-3" /> <p>Loading your programs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-10 text-brand-text">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Programs</h2>
        <p className="text-brand-text-muted">{error.message}</p>
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
            isSaving={saveProgramMutation.isPending}
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
                disabled={deleteProgramMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDeleteProgram}
                isLoading={deleteProgramMutation.isPending}
                leftIcon={<ExclamationTriangleIcon className="h-5 w-5" />}
              >
                Delete Program
              </Button>
            </div>
          }
        >
          <div className="p-5">
            <p className="text-brand-text-muted">
              Are you sure you want to delete the program "
              <strong className="text-brand-text">
                {programToDelete.title}
              </strong>
              "? This action cannot be undone.
            </p>
            {deleteProgramMutation.isError && (
              <p className="mt-3 text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                <strong>Error:</strong> {deleteProgramMutation.error.message}
              </p>
            )}
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default ProgramsListPage;
