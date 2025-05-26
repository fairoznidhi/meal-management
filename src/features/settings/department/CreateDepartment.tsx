"use client";
import Modal from "@/components/modal";
import notificationToast from "@/components/notificationToast";
import { usePatchCreateDepartment } from "@/services/Department/mutations";
import { useDepartmentList } from "@/services/Department/queries";
import { useState } from "react";

const CreateDepartment = () => {
  const subSectionClassName = "ml-24 capitalize text-l mb-4";
  const { mutate: createDept } = usePatchCreateDepartment();
  const [showDeptCreateModal, setShowDeptCreateModal] = useState(false);
  const { data: departmentList = [] } = useDepartmentList();
  const allDeptName = departmentList.map((dept) =>
    dept.dept_name.toLowerCase()
  );
  const initialDeptState = {
    dept_name: "",
    weekend: [] as string[],
  };
  const Weekdays = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const [newDept, setNewDept] = useState(initialDeptState);

  const handleAddDepartment = () => {
    if (newDept.dept_name.length == 0) {
      notificationToast("Department name cannot be empty!", "error");
      return;
    }
    if (allDeptName.includes(newDept.dept_name.toLowerCase())) {
      notificationToast("This department already exists!", "error");
      return;
    }
    let payload = { ...newDept };
    payload.dept_name =
      payload.dept_name.charAt(0).toUpperCase() +
      payload.dept_name.slice(1).toLowerCase();

    createDept(payload, {
      onSuccess: () => {
        notificationToast("Department added successfully", "success");
        resetDepartmentForm();
        setShowDeptCreateModal(false);
      },
      onError: () => {
        notificationToast("Invalid Department ID", "error");
        resetDepartmentForm();
      },
    });
  };

  const toggleWeekend = (day: string) => {
    if (newDept.weekend.includes(day)) {
      setNewDept({
        ...newDept,
        weekend: newDept.weekend.filter((d) => d !== day),
      });
    } else {
      setNewDept({
        ...newDept,
        weekend: [...newDept.weekend, day],
      });
    }
  };

  const resetDepartmentForm = () => {
    setNewDept(initialDeptState);
  };

  return (
    <div>
      <button
        className={`${subSectionClassName}`}
        onClick={() => setShowDeptCreateModal(true)}
      >
        Create Department
      </button>
      <Modal
        isOpen={showDeptCreateModal}
        onClose={() => {
          setShowDeptCreateModal(false);
          resetDepartmentForm();
        }}
        title="Add New Department"
        footer={
          <>
            <button
              onClick={() => {
                setShowDeptCreateModal(false);
                resetDepartmentForm();
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDepartment}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2">Department Name:</label>
            <input
              type="text"
              value={newDept.dept_name}
              onChange={(e) =>
                setNewDept({ ...newDept, dept_name: e.target.value })
              }
              required
              className="border px-4 py-2 w-full rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2">Weekend</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Weekdays.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleWeekend(day)}
                  className={`px-3 py-1 rounded ${
                    newDept.weekend.includes(day)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateDepartment;
