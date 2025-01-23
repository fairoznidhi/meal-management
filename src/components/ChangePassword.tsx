"use client"
import React, { useEffect, useState } from 'react';
import FormField from './FormField';
import { getSession } from 'next-auth/react';
import { usePatchEmployeeProfile } from '@/services/mutations';

const ChangePassword = () => {
    const [session, setSession] = useState<Session | null>(null);
          useEffect(() => {
            const checkSession = async () => {
              const session = await getSession();
              if (session) {
                setSession(session);
                console.log("session from profile",session);
              }
            };
            checkSession();
          }, []);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: ""
    });
    const handlePasswordChange = (e: React.MouseEvent<HTMLButtonElement>)=> {
        e.preventDefault();
        if(formData.newPassword.length<8){
            alert("Password must be at least 8 characters long")
            clearPasswords();
            return;
        }
        if(formData.newPassword!==formData.confirmNewPassword){
            alert("Passwords do not match");
            clearPasswords();
            return;
        }
        passwordUpdate();
    };
    const { mutate} = usePatchEmployeeProfile();
    const passwordUpdate=()=>{
        const data=new FormData();
        data.append("password", formData.newPassword);
        if(session){
            data.append("employee_id",session?.user?.employee_id)
        }
        mutate(data,{
            onSettled: () => {
                alert('Password Updated Successfully.')
                document.getElementById('changepass').close();
            },
            onError: (error) => {
                console.error("Error updating password:", error);
            },
        });
        const formDataObject = Object.fromEntries(data.entries());
        console.log("FormData as object:", formDataObject);
    }
    const handleCancel = ()=> {
        clearPasswords();
    };
    const clearPasswords = () => {
        setFormData({
          newPassword: "",
          confirmNewPassword: "",
        });
      };
      const handleFieldChange = (fieldId: string, value: string) => {
        setFormData((prevData) => ({
          ...prevData,
          [fieldId]: value,
        }));
      };
    return (
        <div className=''>
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white" onClick={()=>document.getElementById('changepass').showModal()}>Change Password</button>
            <dialog id="changepass" className="modal">
            <div className="modal-box">
                <div className='px-4 pt-4'>
                    <h3 className="font-bold text-lg text-center">Change your password</h3>
                    <p className="pt-2 pb-6 text-center font-thin">Enter a new password below to change your password</p>
                    <FormField label={`New Password`} value={formData.newPassword} isEditable={true} type='password'  onChange={(value) => handleFieldChange("newPassword", value)}/>
                    <div className='mb-6'></div>
                    <FormField label={`Confirm New Password`} value={formData.confirmNewPassword} isEditable={true} type='password' onChange={(value) => handleFieldChange("confirmNewPassword", value)}/>
                
                </div>
                <div className="modal-action">
                <form method="dialog">
                    <button className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-2" onClick={handleCancel}>Cancel</button>
                    <button type='submit' className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 " onClick={handlePasswordChange}>Save</button>
                </form>
                </div>
            </div>
            </dialog>
        </div>
    );
};

export default ChangePassword;