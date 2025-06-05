// /src/components/UI/Modal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import Button from "./Button";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  showCloseButtonInHeader?: boolean;
  hideDefaultFooter?: boolean;
  customFooter?: React.ReactNode;
  bodyClassName?: string;
  panelClassName?: string;
  preventCloseOnBackdropClick?: boolean;
  backdropClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButtonInHeader = true,
  hideDefaultFooter = false,
  customFooter,
  bodyClassName,
  panelClassName,
  backdropClassName,
  preventCloseOnBackdropClick = false,
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  const handleActualClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as="div"
          className={`fixed inset-0 flex items-center justify-center p-2 sm:p-4 overflow-x-hidden z-[10000]`}
          open={isOpen}
          onClose={preventCloseOnBackdropClick ? () => {} : handleActualClose}
        >
          <Dialog.Overlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: "circOut" }}
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm ${
              backdropClassName || ""
            }`}
          />

          <motion.div
            onClick={
              preventCloseOnBackdropClick
                ? (e) => e.stopPropagation()
                : undefined
            }
            className={`relative w-full bg-brand-card shadow-brand rounded-xl flex flex-col max-h-[90vh]
              ${sizeClasses[size]} ${panelClassName || ""}`}
            initial={{ opacity: 0, scale: 1, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 30,
              transition: { duration: 0.2 },
            }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            {(title || showCloseButtonInHeader) && (
              <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-brand-border">
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-brand-text"
                  >
                    {title}
                  </Dialog.Title>
                )}
                {showCloseButtonInHeader && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-full text-brand-text-muted hover:bg-brand-secondary/20 hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            <div
              className={`flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar-thin ${
                bodyClassName || ""
              }`}
            >
              {children}
            </div>

            {(customFooter || !hideDefaultFooter) && (
              <div className="flex-shrink-0 flex justify-end items-center space-x-3 p-4 sm:p-5 border-t border-brand-border">
                {customFooter}
                {!hideDefaultFooter && !customFooter && (
                  <Button variant="ghost" onClick={onClose} size="md">
                    Close
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Modal;
