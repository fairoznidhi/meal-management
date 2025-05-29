import { HTMLAttributes, ReactNode } from "react";

export type ButtonType = {
  label: ReactNode;
  size?: "sm" | "md" | "lg" | "xlg" | "full" | "none";
  fillButton?: boolean;
  custom?: boolean;
  login?: boolean;
  updateButton?: boolean;
  successButton?: boolean;
  deleteButton?: boolean;
  cancelButton?: boolean;
  settingsButton?:boolean;
  utilityButton?: boolean;
  shapeButton?: boolean;
  disable?: boolean;
} & HTMLAttributes<HTMLButtonElement>;
