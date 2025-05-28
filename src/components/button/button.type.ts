import { HTMLAttributes, ReactNode } from "react";

export type ButtonType =  {
    label:ReactNode;
    size?:"sm" | "md"
    fillButton?: boolean;
    custom?:boolean
    disable?: boolean;
  } & HTMLAttributes<HTMLButtonElement>