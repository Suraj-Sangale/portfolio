import { constantsList } from "./constant";

export const getConstant = (key) => {
  return constantsList[key.toUpperCase()] ?? null;
};
export const toSnakeCase = (text) => {
  if (!text) return "";
  return text
    .replace(/([a-z])([A-Z])/g, "$1_$2") // handle camelCase → snake_case
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
};

export function convertToUpperCase(text) {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }
  return text.toUpperCase();
}
