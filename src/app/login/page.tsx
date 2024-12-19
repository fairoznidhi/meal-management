"use client"
import { Button } from '@/components/button'
import Input from '@/components/input/Input'
import Image from 'next/image'
import React from 'react'
import loginhero from '../../../public/loginhero.png'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/utils/actions/loginUser'
import RadioInput from '@/components/radioInput/RadioInput'
export type Inputs = {
  usertype: 'employee'|'admin'
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
      const res = await loginUser(data);
      console.log(res);
      if(res.accessToken){
        alert(res.message);
        localStorage.setItem('accessToken',res.accessToken);
        router.push("/");
      }
      else{
        alert(res.message);
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
              <div>
              <RadioInput label='Admin'  {...register("usertype")} value='admin'></RadioInput>
              <RadioInput label='Employee' {...register("usertype")} value='employee'></RadioInput>
              </div>
              <Input type='text' placeholder='Email' {...register("email")}></Input>
              <Input type='password' placeholder='Password' {...register("password")}></Input>
              <Button label='Log In' size='md' className='w-full'><input type="submit" /></Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
