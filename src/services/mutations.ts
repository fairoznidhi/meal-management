import { useMutation } from "@tanstack/react-query";
import { patchEmployeeProfile, patchForgetPassword, patchGroupMealUpdate, patchToggleDefaultMealStatus } from "./api";

export function useToggleDefaultMealStatus(date:string) {
    return useMutation({
        mutationFn: ()=>patchToggleDefaultMealStatus(date),
        onSuccess: () => {
          console.log("Meal preference toggled successfully");
        },
        onError: (error) => {
          console.error("Error toggling meal preference:", error);
        },
  
    });
  }
  export function usePatchEmployeeProfile() {
    return useMutation({
      mutationFn: (formData: FormData) => patchEmployeeProfile(formData),
      onSuccess: () => {
        console.log("Profile updated successfully");
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
      },
    });
  }
  export function usePatchGroupMealUpdate() {
    return useMutation({
      mutationFn: (data:Array) => patchGroupMealUpdate(data),
      onSuccess: () => {
        console.log("Meal Updated Succesfully");
      },
      onError: (error) => {
        console.error("Error updating meal:", error);
      },
    });
  }
  export function usePatchForgetPassword() {
    return useMutation({
      mutationFn: (data:object) => patchForgetPassword(data),
      onSuccess: () => {
        console.log("Mail sent");
      },
      onError: (error) => {
        console.error("Error mail", error);
      },
    });
  }