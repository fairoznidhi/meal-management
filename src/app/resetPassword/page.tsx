"use client"
import { useSearchParams } from 'next/navigation'
const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token')
    console.log(token)
    return (
        <div>
            
        </div>
    );
};

export default ResetPassword;