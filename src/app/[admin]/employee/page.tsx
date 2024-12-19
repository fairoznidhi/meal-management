"use client"

import Form from "@/components/create_user/form"
import EmpTable from "@/components/employee_table";

const employee=()=>{
  const columns = [
    { key: "name", label: "Name", editable: true },
    { key: "penalties", label: "Penalties", editable: true },
    { key: "notes", label: "Notes", editable: true },
  ];

  const initialData = [
    { name: "Alice", penalties: "2", notes: "No Beef" },
    { name: "Bob", penalties: "1", notes: "No Fish" },
  ];

  const handleDataChange = (updatedData: any[]) => {
    console.log("Updated Data:", updatedData);
  };
    return (
        <div className="m-20 items-center justify-center">
          <p className="text-2xl ms-4">Employee List</p>
        {/*<Form></Form>*/}
        
        <div className="p-4">
      
      <EmpTable
        columns={columns}
        initialData={initialData}
        
      />
    </div>
      </div>
    );
}
export default employee