"use client"
import { Button } from "@/components/button";
import Input from "@/components/input/Input";
import { usePatchForgetPassword } from "@/services/mutations";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
export type ForgetPasswordInputs = {
  email: string;
};
const BASE_URL=`${process.env.NEXT_PUBLIC_URL}`;
const ForgetPasswordPage = () => {
    const {mutate}=usePatchForgetPassword();
  const { register, handleSubmit } = useForm<ForgetPasswordInputs>();
  const onSubmit = async (data: ForgetPasswordInputs) => {
      console.log(data)
      const modifiedData={...data,
        link: `${BASE_URL}/resetPassword`,
      }
      mutate(modifiedData,{
        onSuccess: () => {
            alert('Mail sent.')
        },
        onError: (error) => {
            alert('Wrong Email')
            console.error("Error updating password:", error);
        },
    });
    };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card shadow-xl w-1/5">
        <div className="card-body">
          <h2 className="card-title">Forgot your password?</h2>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
            ></Input>
            <Button label="Send Mail" size="md" className="w-full"></Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
