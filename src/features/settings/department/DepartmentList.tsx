"use client";

import Modal from "@/components/modal";
import notificationToast from "@/components/notificationToast";
import Table, { Column, Row } from "@/components/Table";
import { department } from "@/model/department";
import { deleteDepartment } from "@/services/Department/api";
import { useDepartmentList } from "@/services/Department/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EditDepartment from "./EditDepartment";

const DepartmentList = () => {
  const subSectionClassName = "ml-24 capitalize text-l mb-4";
  const [showDeptListModal, setShowDeptListModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const initialDeptState: department = {
    dept_id: 0,
    dept_name: "",
    weekend: [],
  };
  const [selectedDept, setSelectedDept] = useState(initialDeptState);

  const { data: departmentList = [] } = useDepartmentList();
  const queryClient = useQueryClient();
  const columns: Column[] = [
    {
      key: "dept_id",
      label: "ID",
    },
    {
      key: "dept_name",
      label: "Name",
    },
    {
      key: "weekend",
      label: "Weekend",
      render: (value: any) => value.join(", "),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value, row, rowIndex) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleEdit(row, rowIndex)}
            className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.dept_id)}
            disabled={true}
            className={`${
              true
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } text-white px-2 py-1 rounded`}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (row: Row, rowIndex: number) => {
    console.log("Edit row", row);
    setSelectedDept(row as department);
    setEditModalOpen(true);
  };

  const handleDelete = async (deptId: number) => {
    console.log("Delete dept id:", deptId);
    try {
      await deleteDepartment(deptId);
      notificationToast("Department Deleted", "success");
      queryClient.invalidateQueries({ queryKey: ["DepartmentList"] });
    } catch (err) {
      console.error("Error deleting department:", err);
      notificationToast("Error deleting department", "error");
    }
  };

  return (
    <div>
      <button
        className={`${subSectionClassName}`}
        onClick={() => setShowDeptListModal(true)}
      >
        Department List
      </button>
      <Modal
        isOpen={showDeptListModal}
        onClose={() => {
          setShowDeptListModal(false);
        }}
        title="Department List"
      >
        <Table columns={columns} data={departmentList} />
      </Modal>
      {selectedDept && (
        <EditDepartment
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          department={selectedDept}
        />
      )}
    </div>
  );
};

export default DepartmentList;
