"use client";
import CreateDepartment from "./CreateDepartment";
import DepartmentList from "./DepartmentList";

const DepartmentSettings = () => {
  const subSectionClassName = "ml-24 capitalize text-l mb-4";
  return (
    <div className="">
      <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800 font-medium"><CreateDepartment /></span>

      <span className=""><DepartmentList/></span>
    </div>
  );
};

export default DepartmentSettings;
