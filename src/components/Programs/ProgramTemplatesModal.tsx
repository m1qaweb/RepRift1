import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";
import {
  getProgramTemplates,
  importProgramFromTemplate,
} from "../../services/programService";
import { ProgramTemplate } from "../../types/data";
import {
  Squares2X2Icon,
  ArrowDownCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ProgramTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProgramTemplatesModal: React.FC<ProgramTemplatesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const {
    data: templates = [],
    isLoading,
    isError,
  } = useQuery<ProgramTemplate[]>({
    queryKey: ["programTemplates"],
    queryFn: getProgramTemplates,
    enabled: isOpen,
    staleTime: Infinity,
  });

  const importMutation = useMutation({
    mutationFn: importProgramFromTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      onClose();
    },
  });

  const handleImport = (templateId: string) => {
    importMutation.mutate(templateId);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-6">
          <Spinner size="lg" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center text-center p-6">
          <ExclamationTriangleIcon className="h-10 w-10 text-error mb-3" />
          <p className="font-semibold text-error mb-2">Could not load templates.</p>
          <p className="text-sm text-brand-text-muted">Please try again later.</p>
        </div>
      );
    }
    if (templates.length === 0) {
      return (
        <div className="flex flex-col items-center text-center p-6">
          <Squares2X2Icon className="h-12 w-12 text-brand-primary/20 mb-4" />
          <p className="font-semibold text-brand-text">No templates available</p>
          <p className="text-sm text-brand-text-muted">Check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar-thin -mr-2">
        <AnimatePresence>
          {templates.map((template) => (
            <motion.div
              key={template.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-brand-card/50 dark:bg-brand-card/40 backdrop-blur-lg rounded-xl shadow-lg border border-brand-border/20 p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-brand-text mb-2 truncate">
                  {template.title}
                </h3>
                <p className="text-sm text-brand-text-muted line-clamp-3 mb-4">
                  {template.description}
                </p>
                <p className="text-xs text-brand-text-muted">
                  {template.exercises.length} Exercise
                  {template.exercises.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                isLoading={importMutation.isPending && importMutation.variables === template.id}
                onClick={() => handleImport(template.id)}
                leftIcon={<ArrowDownCircleIcon className="h-4 w-4" />}
              >
                Import
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Browse Program Templates"
      size="xl"
      panelClassName="dark:bg-brand-card/80 bg-brand-card-light/95 backdrop-blur-xl"
      hideDefaultFooter
    >
      {renderContent()}
    </Modal>
  );
};

export default ProgramTemplatesModal;
