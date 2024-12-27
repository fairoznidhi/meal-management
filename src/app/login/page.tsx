"use client"
import { Button } from '@/components/button'
import Input from '@/components/input/Input'
import Image from 'next/image'
import React from 'react'
import loginhero from '../../../public/loginhero.png'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/utils/actions/loginUser'
import { jwtDecode } from "jwt-decode";
import { CustomUser } from './JwtPayload'
export type Inputs = {
  // usertype: 'employee'|'admin'
  email: string
  password: string
}
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<Inputs>()
  const router=useRouter();
  const onSubmit = async (data: Inputs) =>{
    console.log(data);
    try {
      // Call the loginUser function and get the response
      const res = await loginUser(data)
      console.log("Login response:", res)

      // Store the token in localStorage
      localStorage.setItem('accessToken', res)
      const token = res
      console.log("Stored Token:", token)

      // Decode the JWT token
      const decodedToken = jwtDecode<CustomUser>(token)
      console.log("Decoded token:", decodedToken)

      // Check if the user is admin or not and route accordingly
      if (decodedToken.is_admin === true) {
        console.log('Redirecting to /dashboard')
        // Redirect to dashboard
        router.push("/adminDashboard")
      } else if (decodedToken.is_admin === false) {
        console.log('Redirecting to /calendar')
        // Redirect to calendar
        router.push("/calendar")
      } else {
        console.error('Unexpected token data: is_admin is undefined')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        throw new Error(err.message);
      } else {
        console.error('Unknown error occurred', err);
        throw new Error('Unknown error occurred');
      }
    }
  }
  return (
    <div>
      <div className='grid grid-cols-2 min-h-screen '>
        <div className='bg-[#e7f5fd] flex justify-center pt-10'>
          <div className=''>
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
        <div className='flex justify-center w-full pt-60'>
          <div className='w-4/6'>
            <h1 className='text-3xl font-semibold mb-2'>Welcome Back!</h1>
            <p className='text-xs text-neutral-400 mb-4'>Please enter your details</p>
            <div className='mb-4'>
              
            </div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              {/* <div>
              <RadioInput label='Admin'  {...register("usertype")} value='admin'></RadioInput>
              <RadioInput label='Employee' {...register("usertype")} value='employee'></RadioInput>
              </div> */}
              <Input type='text' placeholder='Email' {...register("email")}></Input>
              <Input type='password' placeholder='Password' {...register("password")}></Input>
              <Button label='Log In' size='md' className='w-full' ></Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
