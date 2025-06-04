// /src/components/UI/Modal.tsx - Generic modal component with Framer Motion animations.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react"; // Using Headless UI for accessibility

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as={motion.div} // Use motion.div for headless UI integration with Framer Motion
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <motion.div // Backdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70" />
            </motion.div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              ​
            </span>

            <motion.div // Modal Panel
              className={`inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-light-background dark:bg-dark-background shadow-xl rounded-lg ${sizeClasses[size]}`}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3,
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
            >
              {title && (
                <Dialog.Title
                  as="h3"
                  id="modal-title"
                  className="text-lg font-medium leading-6 text-light-text dark:text-dark-text mb-4"
                >
                  {title}
                </Dialog.Title>
              )}
              <div>{children}</div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-light-primary dark:text-dark-primary bg-transparent hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Modal;
