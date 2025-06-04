// /src/pages/ProgramsListPage.tsx – Lists all available workout programs.
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Program, fetchPrograms } from "../utils/fakeApi";
import ProgramCard from "../components/Programs/ProgramCard";
import Button from "../components/UI/Button";
import ProgramEditorForm from "../components/Programs/ProgramEditorForm"; // For creating/editing
import Modal from "../components/UI/Modal";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Spinner from "../components/UI/Spinner";

const ProgramsListPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = () => {
    setIsLoading(true);
    fetchPrograms()
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleOpenModalForNew = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (programId: string) => {
    const programToEdit = programs.find((p) => p.id === programId);
    if (programToEdit) {
      setEditingProgram(programToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null); // Clear editing state
  };

  const handleSaveProgram = (savedProgram: Program) => {
    // Update local state to reflect changes without immediate re-fetch
    // This helps make the UI feel faster
    if (editingProgram) {
      // It was an edit
      setPrograms((prev) =>
        prev.map((p) => (p.id === savedProgram.id ? savedProgram : p))
      );
    } else {
      // It was a new program
      setPrograms((prev) => [...prev, savedProgram]);
    }
    // Optionally re-fetch all to ensure consistency: loadPrograms();
    handleCloseModal();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for each card
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
          Your Workout Programs
        </h1>
        <Button
          variant="primary"
          onClick={handleOpenModalForNew}
          leftIcon={<PlusCircleIcon className="h-5 w-5" />}
        >
          Create Program
        </Button>
      </div>

      <AnimatePresence>
        {programs.length > 0 ? (
          <motion.div
            // For Masonry, you might need a library like 'masonic' or custom CSS grid setup for true masonry.
            // Tailwind CSS Grid with varying col-spans or a fixed number of columns can approximate it.
            // This example uses a simple responsive grid.
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {programs.map((program) => (
              // The ProgramCard should define its own `initial` and `animate` for the "fade-in as items mount"
              // or have variants passed to it. Parent `staggerChildren` controls timing.
              <ProgramCard
                key={program.id}
                program={program}
                onEditClick={handleOpenModalForEdit}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 text-light-secondary dark:text-dark-secondary"
          >
            <p className="mb-2 text-lg">No programs found.</p>
            <p>Get started by creating your first workout program!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isModalOpen && ( // Modal presence handled by its own AnimatePresence usually
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProgram ? "Edit Program" : "Create New Program"}
          size="xl"
        >
          <ProgramEditorForm
            program={editingProgram}
            onSave={handleSaveProgram}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProgramsListPage;
