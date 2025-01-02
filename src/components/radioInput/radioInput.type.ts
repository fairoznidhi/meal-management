import { HTMLAttributes } from "react";

export type RadioInputType={
    label:string
    name?: string,
} & HTMLAttributes<HTMLInputElement>