"use client";
import CreateDepartment from "./CreateDepartment";
import DepartmentList from "./DepartmentList";

const DepartmentSettings = () => {
  const subSectionClassName = "ml-24 capitalize text-l mb-4";
  return (
    <div className="flex flex-col w-full items-start">
      <CreateDepartment />
      <DepartmentList/>
    </div>
  );
};

export default DepartmentSettings;
