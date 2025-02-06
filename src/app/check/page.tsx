"use client"
import React from 'react';
import { toast } from 'react-toastify';

const Check = () => {
    const notify = () => toast('🦄 Wow so easy!', {
      });
    return (
        <div>
            <button onClick={notify} className='m-4 p-8'>Hello</button>
        </div>
    );
};

export default Check;