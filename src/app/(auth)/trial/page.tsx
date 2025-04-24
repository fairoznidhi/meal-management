import InputField from "@/components/InputField";
import withLabel from "@/components/LabeledInputField";
import React from "react";

const LabelInputField = withLabel(InputField);
const Page = () => {
  return (
    <div className="mt-32">
      <LabelInputField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        name="email"
      />
      <LabelInputField
        label="Password"
        type="password"
        placeholder="Enter your password"
        name="password"
      />
    </div>
  );
};

export default Page;
