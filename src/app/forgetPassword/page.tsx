"use client";
import { Button } from "@/components/button";
import Input from "@/components/input/Input";
import { usePatchForgetPassword } from "@/services/mutations";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
export type ForgetPasswordInputs = {
  email: string;
};
const BASE_URL = `${process.env.NEXT_PUBLIC_URL}`;
const ForgetPasswordPage = () => {
  const { mutate } = usePatchForgetPassword();
  const [mailSent,setMailSent]=useState(false);
  const { register, handleSubmit } = useForm<ForgetPasswordInputs>();
  const onSubmit = async (data: ForgetPasswordInputs) => {
    const modifiedData = { ...data, link: `${BASE_URL}/resetPassword` };
    mutate(modifiedData, {
      onSuccess: () => {
        setMailSent(true);
        // alert("Mail sent to your email.");
      },
      onError: (error) => {
        alert("Wrong Email");
        setMailSent(false);
        console.error("Error updating password:", error);
      },
    });
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card shadow-xl w-1/5">
        <div className="card-body">
          <h2 className="card-title pb-6 text-center">Forgot your password?</h2>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
            ></Input>
            <Button label={mailSent ? "Mail Sent to your email" : "Send Mail"} size="md" className="w-full" disable={mailSent}></Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
