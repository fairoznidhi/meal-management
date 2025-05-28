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
import { AxiosError } from "axios";
interface DepartmentListProps {
  subSectionClassName: string;
}
const DepartmentList:React.FC<DepartmentListProps> = ({subSectionClassName}) => {
  const [showDeptListModal, setShowDeptListModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<department | null>(null);

  const initialDeptState: department = {
    dept_id: 0,
    dept_name: "",
    weekend: [],
  };
  const [selectedDept, setSelectedDept] = useState(initialDeptState);

  const { data: departmentList = [] } = useDepartmentList();
  const queryClient = useQueryClient();

  const handleEdit = (row: Row) => {
    setSelectedDept(row as department);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (dept: department) => {
    setDeptToDelete(dept);
    setConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deptToDelete) return;

    try {
      await deleteDepartment(deptToDelete.dept_id);
      notificationToast("Department deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["DepartmentList"] });
    } catch (err) {
      const error = err as AxiosError;
      const rawMessage =
        typeof error?.response?.data === "string"
          ? error.response?.data
          : (error?.response?.data as any)?.message ||
            error.message ||
            "Failed to delete department!";
      const message =
        typeof rawMessage === "string"
          ? rawMessage.charAt(0).toUpperCase() + rawMessage.slice(1)
          : "Something went wrong";

      notificationToast(message, "error");
    } finally {
      setConfirmDeleteModalOpen(false);
      setDeptToDelete(null);
    }
  };

  const columns: Column[] = [
    { key: "dept_id", label: "ID" },
    { key: "dept_name", label: "Name" },
    {
      key: "weekend",
      label: "Weekend",
      render: (value: string[]) => value.join(", "),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row as department)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <button
        className={`${subSectionClassName}`}
        onClick={() => setShowDeptListModal(true)}
      >
        Department List
      </button>

      {/* Department Table Modal */}
      <Modal
        isOpen={showDeptListModal}
        onClose={() => setShowDeptListModal(false)}
        title="Department List"
      >
        <Table columns={columns} data={departmentList} />
      </Modal>

      {/* Edit Modal */}
      {selectedDept && (
        <EditDepartment
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          department={selectedDept}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete the department{" "}
              <span className="font-bold text-red-600">
                {deptToDelete?.dept_name}
              </span>
              ?
            </h3>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setConfirmDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;