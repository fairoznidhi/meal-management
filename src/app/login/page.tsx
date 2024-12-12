"use client"
import { Button } from '@/components/button'
import React from 'react'

const LoginPage = () => {
  return (
    <div>
      <div className='grid grid-cols-2'>
        <div>class1</div>
        <div className='loginForm'>
            <Button label='Log In' size='md' className='btn bg-lightBlue hover:bg-darkBlue' onClick={()=>console.log('Button clicked')}/>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
