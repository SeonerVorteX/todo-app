export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { success: boolean; errors: string[] } => {
  const minLength = 8;
  const charRegex = /[a-zA-ZİŞĞÜÖÇƏ]/u;
  const digitRegex = /\d/;
  const errors = [];
  let success = false;

  if (password.length < minLength) {
    errors.push("Pasword must be at least 8 characters long");
  }

  if (!charRegex.test(password)) {
    errors.push("Password must contain at least one letter");
  }

  if (!digitRegex.test(password)) {
    errors.push("Password must contain at least one digit");
  }

  if (errors.length == 0) {
    success = true;
  }

  return { success, errors };
};
