export const contactValidation = {
  from_name: {
    required: "Name is required",
    maxLength: {
      value: 100,
      message: "Name should be less than 100 characters",
    },
  },
  from_email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email format",
    },
  },
  subject: {
    required: "Subject is required",
  },
  message: {
    required: "Message is required",
    minLength: {
      value: 1,
      message: "Message must be at least 5 characters",
    },
  },
};
