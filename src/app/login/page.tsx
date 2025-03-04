"use client";
import { Button } from "@/components/button";
import Input from "@/components/input/Input";
import ForgetPassword from "@/features/forgetPassword/ForgetPassword";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import loginhero from "../../../public/loginhero.png";
import { toast } from "react-toastify";
import notificationToast from "@/components/notificationToast";
export type Inputs = {
  email: string;
  password: string;
};
const LoginPage = () => {
  const [wrongEmailOrPass, setWrongEmailOrPass] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const router = useRouter();
  const { data: session, status } = useSession();
  // useEffect(() => {
  // //   console.log("Login session error flickr ",session)
  //   if (status === "authenticated" && session?.user?.is_admin) {
  //     // router.push("/adminDashboard");
  //     localStorage.setItem("adminView","true")
  //   } 
  //   // else if (status === "authenticated" && !session?.user?.is_admin) {
  // //     router.push("/userDashboard");
  // //   }
  // }, 
  // [session, status, router]);
  const onSubmit = async (data: Inputs) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.error) {
        setWrongEmailOrPass(true);
        setLoading(false);
      } else if (result?.ok) {
        const session = await fetch("/api/auth/session").then((res) =>
          res.json()
        );
        notificationToast("Welcome to your profile!","success");
        if (session?.user?.is_admin) {
          localStorage.setItem("adminView","true")
          router.push("/adminDashboard");
        } else {
          router.push("/userDashboard");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        throw new Error(err.message);
      } else {
        console.error("Unknown error occurred", err);
        throw new Error("Unknown error occurred");
      }
    }
  };
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen ">
        <div className="hidden bg-[#e7f5fd] md:flex justify-center pt-10">
          <div className="">
            <Image
              src={loginhero}
              alt="Login Hero"
              width={600}
              height={600}
              quality={100}
              priority={true}
            />
          </div>
        </div>
        <div className="flex justify-center w-full items-center">
          <div className="w-4/6">
            <h1 className="text-3xl font-semibold mb-2">Welcome Back!</h1>
            <p className="text-xs text-neutral-400 mb-4">
              Please enter your details
            </p>
            <div className="mb-4"></div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="text"
                placeholder="Email"
                {...register("email")}
              ></Input>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              ></Input>
              {wrongEmailOrPass && (
                <div className="text-red-500 text-xs mb-4">
                  Invalid email or password. Please try again.
                </div>
              )}
              <ForgetPassword></ForgetPassword>
              <Button
                label={loading ? "Logging in..." : "Log In"}
                size="md"
                className="w-full"
                disable={loading}
              ></Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
