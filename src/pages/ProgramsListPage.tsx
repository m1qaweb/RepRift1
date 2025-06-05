// /src/pages/ProgramsListPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Program, fetchPrograms } from "../utils/fakeApi";
import ProgramCard from "../components/Programs/ProgramCard";
import Button from "../components/UI/Button";
import ProgramEditorForm from "../components/Programs/ProgramEditorForm";
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
    setEditingProgram(null);
  };

  const handleSaveProgram = (savedProgram: Program) => {
    if (editingProgram) {
      setPrograms((prev) =>
        prev.map((p) => (p.id === savedProgram.id ? savedProgram : p))
      );
    } else {
      setPrograms((prev) => [savedProgram, ...prev]); // Add new to the start
    }
    handleCloseModal();
  };

  // Variants for the grid of program cards
  const programsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Adjusted stagger timing
      },
    },
  };

  // Variants for page content wrapper if needed for entrance animation
  const contentWrapperVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (isLoading) {
    return (
      // This loading state takes up significant vertical space matching typical page content height
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-10 text-brand-text">
        <Spinner size="lg" className="mb-3" />
        <p>Loading your programs...</p>
      </div>
    );
  }

  return (
    // This outermost div is just for overall page structure / page-level animations.
    // Padding like `py-6 sm:py-8` ensures space from Navbar/Footer if App.tsx doesn't provide it.
    <motion.div
      className="py-6 sm:py-8"
      initial="initial"
      animate="animate"
      variants={contentWrapperVariants} // Animate the whole page content in
    >
      {/* --- Main Content Wrapper - THIS GETS THE "BRIGHTER" BACKGROUND --- */}
      <div className="bg-brand-card rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
        {/* Header section: Title and Create Button */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-text mb-4 sm:mb-0">
            Your Workout Programs
          </h1>
          <Button
            variant="primary" // Ensure this button style is distinct and visible
            onClick={handleOpenModalForNew}
            leftIcon={<PlusCircleIcon className="h-5 w-5" />}
            size="md"
          >
            Create Program
          </Button>
        </header>

        {/* Program Cards Grid or Empty State */}
        <AnimatePresence mode="wait">
          {programs.length > 0 ? (
            <motion.div
              key="programs-grid" // Key for AnimatePresence
              variants={programsGridVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }} // Basic exit for the grid
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6" // Consistent gap
            >
              {programs.map((program) => (
                <ProgramCard // ProgramCard has its own theming and internal <Card>
                  key={program.id}
                  program={program}
                  onEditClick={handleOpenModalForEdit}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-programs" // Key for AnimatePresence
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} // Delay if grid was exiting
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-12 sm:py-16" // More padding for empty state
            >
              <PlusCircleIcon className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-brand-primary/30 mb-5" />
              <h2 className="text-xl font-semibold text-brand-text mb-2">
                No Workout Programs Found
              </h2>
              <p className="text-sm text-brand-text-muted max-w-sm mx-auto mb-6">
                It looks like you haven't created any programs yet. Get started
                by clicking the button above!
              </p>
              {/* Optionally, a button here too, but the one in header is primary */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>{" "}
      {/* End of Main Content Wrapper with bg-brand-card */}
      {/* Modal for ProgramEditorForm (ensure Modal styling allows it to pop) */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProgram ? "Edit Program" : "Create New Workout Program"}
          size="4xl" // Keep large size for the form
          hideDefaultFooter // Form provides its own footer/actions
          panelClassName="dark:bg-[rgb(var(--color-card-rgb)/0.95)] backdrop-blur-lg" // Slightly more opaque modal
          preventCloseOnBackdropClick={true} // To prevent accidental close for complex form
        >
          <ProgramEditorForm
            program={editingProgram}
            onSave={handleSaveProgram}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </motion.div>
  );
};

export default ProgramsListPage;
