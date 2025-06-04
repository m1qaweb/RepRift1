// /src/utils/validators.ts - Input validation functions.

export interface ValidationError {
  // This interface isn't strictly used by RHF directly but good for other contexts
  field?: string;
  message: string;
}

/**
 * Validates if a value is not empty.
 * @param value The value to check.
 * @param fieldName The name of the field for the error message.
 * @returns An error message string if empty, otherwise true.
 */
export const validateRequired = (
  value: string,
  fieldName: string = "This field"
): string | true => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required.`;
  }
  return true; // <<<< MUST BE true FOR SUCCESS
};

/**
 * Validates an email address format.
 * @param email The email string to validate.
 * @returns An error message string if invalid, otherwise true.
 */
export const validateEmail = (email: string): string | true => {
  if (!email) {
    // This case should ideally be handled by `validateRequired` first if email is mandatory.
    // If validateEmail is used standalone and email can be optional but valid if present,
    // then this check is fine. If email is always required, `required: "message"` is better.
    // For now, assuming `required` handles the empty case.
    // return 'Email is required.'; // If you want this validator to also check for emptiness
  }
  // Allow empty string to pass this specific validator if `required` handles empty check
  if (email && email.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
  }
  return true; // <<<< MUST BE true FOR SUCCESS (even for initially empty if not checked here)
};

/**
 * Validates password strength.
 * Example: At least 8 characters, one uppercase, one lowercase, one number.
 * @param password The password string to validate.
 * @returns An error message string if invalid, otherwise true.
 */
export const validatePassword = (password: string): string | true => {
  if (!password) {
    // Similar to email, `required` should handle the empty case.
    // return 'Password is required.';
  }

  // Allow empty string to pass this specific validator if `required` handles empty check
  if (password && password.trim() !== "") {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
  }
  return true; // <<<< MUST BE true FOR SUCCESS
};
