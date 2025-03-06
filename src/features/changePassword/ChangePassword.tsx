"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { usePatchEmployeeProfile } from "@/services/mutations";
import FormField from "@/components/FormField";
import { Session } from "next-auth";
import notificationToast from "@/components/notificationToast";

const ChangePassword = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [savePass,setSavePass]=useState(false)
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setSession(session);
      }
    };
    checkSession();
  }, []);
  
  const handlePasswordChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmNewPassword) {
      setError("Password fields cannot be empty.");
      clearPasswords();
      return;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      clearPasswords();
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match.");
      clearPasswords();
      return;
    }
    setSavePass(true);
    passwordUpdate();
  };
  const { mutate } = usePatchEmployeeProfile();
  const passwordUpdate = () => {
    const data = new FormData();
    data.append("password", formData.newPassword);
    if (session) {
      data.append("employee_id", session?.user?.employee_id);
    }
    mutate(data, {
      onSettled: () => {
        clearPasswords();
        (document.getElementById("changepass") as HTMLDialogElement).close();
        notificationToast("Password updated successfully!", "success");
      },
      onError: (error) => {
        console.error("Error updating password:", error);
        notificationToast("Failed to update password!", "error");
      },
    });
    const formDataObject = Object.fromEntries(data.entries());
  };
  const handleCancel = () => {
    setError(null);
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
    <div className="">
      <button
        className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"
        onClick={() =>
          (
            document.getElementById("changepass") as HTMLDialogElement
          ).showModal()
        }
      >
        Change Password
      </button>
      <dialog id="changepass" className="modal">
        <div className="modal-box">
          <div className="px-4 pt-4">
            <h3 className="font-bold text-lg text-center">
              Change your password
            </h3>
            <p className="pt-2 pb-6 text-center font-thin">
              Enter a new password below to change your password
            </p>
            <FormField
              id="password"
              label={`New Password`}
              value={formData.newPassword as string}
              isEditable={true}
              type="password"
              onChange={(value) => handleFieldChange("newPassword", value as string)}
            />
            <div className="mb-6"></div>
            <FormField
              id="confirm_password"
              label={`Confirm New Password`}
              value={formData.confirmNewPassword as string}
              isEditable={true}
              type="password"
              onChange={(value) =>
                handleFieldChange("confirmNewPassword", value as string)
              }
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
                onClick={handlePasswordChange}
                disabled={savePass}
              >
                {savePass? 'Saving...':'Save'}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ChangePassword;
