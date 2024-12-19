import { HTMLAttributes } from "react";

export type InputType={
    type: string,
    name?: string,
    placeholder?: string
} & HTMLAttributes<HTMLInputElement>