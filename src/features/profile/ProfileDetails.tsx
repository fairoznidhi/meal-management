"use client";

import React from "react";
import FormField from "@/components/FormField";

type ProfileDetailsProps<FormDataType> = {
  formData: FormDataType;
  isEditable?: boolean;
  onChange?: (field: keyof FormDataType, value: string) => void;
};

const ProfileDetails = <FormDataType extends Record<string, any>>({
  formData,
  isEditable = false,
  onChange,
}: ProfileDetailsProps<FormDataType>) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 mt-6">
      {Object.keys(formData).map((field) => (
        <FormField
          key={field}
          id={field}
          label={field}
          value={formData[field]}
          isEditable={isEditable}
          onChange={(value) => onChange && onChange(field as keyof FormDataType, value)}
          options={field === "department" ? ["Development", "Call Center"] : undefined}
        />
      ))}
    </div>
  );
};

export default ProfileDetails;
