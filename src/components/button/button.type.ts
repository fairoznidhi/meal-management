import { HTMLAttributes } from "react";

export type ButtonType =  {
    label:string;
    size?:"sm" | "md"
  } & HTMLAttributes<HTMLButtonElement>