import { constantsList } from "./constant";

export const getConstant = (key) => {
  return constantsList[key.toUpperCase()] ?? null;
};
