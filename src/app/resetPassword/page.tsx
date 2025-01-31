"use client";
import FormField from "@/components/FormField";
import { usePatchResetPassword } from "@/services/mutations";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const ResetPassword = () => {
  const {data:session}=useSession();

  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [loading,setLoading]=useState(false);
  const router=useRouter();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  useEffect(()=>{
    router.push('/');
  },[session])
  const handlePasswordChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      clearPasswords();
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("Passwords do not match");
      clearPasswords();
      return;
    }
    passwordUpdate();
  };
  const { mutate } = usePatchResetPassword();
  const passwordUpdate = () => {
    const payload = {
        data: {
            password: formData.newPassword,
        },
        token: token,
    };
    setLoading(true);
    mutate(payload, {
        onSuccess:()=>{
            
            router.push("/login")
        },
      onSettled: () => {
        clearPasswords();
        setLoading(true);
      },
      onError: (error) => {
        console.error("Error updating password:", error);
      },
    });
  };
  const handleCancel = () => {
    clearPasswords();
    router.push("/login")
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="modal-box">
        <div className="px-4 pt-4">
          <h3 className="font-bold text-lg text-center">
            Reset your password
          </h3>
          <p className="pt-2 pb-6 text-center font-thin">
            Enter a new password below to change your password
          </p>
          <FormField
            id="password"
            label={`New Password`}
            value={formData.newPassword}
            isEditable={true}
            type="password"
            onChange={(value) => handleFieldChange("newPassword", value)}
          />
          <div className="mb-6"></div>
          <FormField
            id="confirm_password"
            label={`Confirm New Password`}
            value={formData.confirmNewPassword}
            isEditable={true}
            type="password"
            onChange={(value) => handleFieldChange("confirmNewPassword", value)}
          />
        </div>
        <div className="modal-action">
          <form method="dialog">
            {!loading && <button
              className={`px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-2 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>}
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={handlePasswordChange}
              disabled={loading}
            >
              {!loading?'Save':'Saving...'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
