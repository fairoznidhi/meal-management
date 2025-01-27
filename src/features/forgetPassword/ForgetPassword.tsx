import Link from "next/link";
import React from "react";

const ForgetPassword = () => {
  return (
    <div className="ml-1 mb-2">
      <Link href="/forgetPassword">
        <span className="text-sm font-medium text-lightBlue hover:underline">
          Forgot your password?
        </span>
      </Link>
    </div>
  );
};

export default ForgetPassword;
