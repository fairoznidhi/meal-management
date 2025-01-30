import { HTMLAttributes } from "react";

export type ButtonType =  {
    label:string;
    size?:"sm" | "md"
    fillButton?: boolean;
    disable?: boolean;
  } & HTMLAttributes<HTMLButtonElement>