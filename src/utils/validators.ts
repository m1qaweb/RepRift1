// /src/utils/validators.ts - Input validation functions.

export interface ValidationError {
  field?: string;
  message: string;
}

export const validateRequired = (
  value: string,
  fieldName: string = "This field"
): string | true => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required.`;
  }
  return true;
};

export const validateEmail = (email: string): string | true => {
  if (!email) {
  }

  if (email && email.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
  }
  return true;
};

export const validatePassword = (password: string): string | true => {
  if (!password) {
  }

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
  return true;
};
