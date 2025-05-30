"use client";
import { Button } from "@/components/button";
import Modal from "@/components/modal";
import notificationToast from "@/components/notificationToast";
import {
  usePatchCreateDepartment,
  usePatchUpdateDepartment,
} from "@/services/Department/mutations";
import { useDepartmentList } from "@/services/Department/queries";
import { useEffect, useState } from "react";

type EditDepartmentProps = {
  isOpen: boolean;
  onClose: () => void;
  department: {
    dept_name: string;
    weekend: string[];
  };
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

const EditDepartment: React.FC<EditDepartmentProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const [form, setForm] = useState(department);
  const { mutate: updateDept } = usePatchUpdateDepartment();
  const { data: departmentList = [] } = useDepartmentList();
    const allDeptName = departmentList.map((dept) =>
      dept.dept_name.toLowerCase()
    );

  useEffect(() => {
    setForm(department);
  }, [department]);

  const handleUpdate = () => {
    if (form.dept_name.length == 0) {
      notificationToast("Department name cannot be empty!", "error");
      return;
    }
    if (allDeptName.includes(form.dept_name.toLowerCase()) && form.dept_name.toLowerCase()!=department.dept_name.toLowerCase()) {
      notificationToast("This department already exists!", "error");
      return;
    }
    let payload = { ...form };
    payload.dept_name =
      payload.dept_name.charAt(0).toUpperCase() +
      payload.dept_name.slice(1).toLowerCase();
    updateDept(payload, {
      onSuccess: () => {
        notificationToast("Department updated", "success");
        onClose();
      },
      onError: () => {
        notificationToast("Update failed", "error");
      },
    });
  };

  const toggleWeekend = (day: string) => {
    setForm((prev) => ({
      ...prev,
      weekend: prev.weekend.includes(day)
        ? prev.weekend.filter((d) => d !== day)
        : [...prev.weekend, day],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Department"
      footer={
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            cancelButton={true}
            label="Cancel"
          />
          <Button
            onClick={handleUpdate}
            successButton={true}
            label="Update"
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={form.dept_name}
            onChange={(e) => setForm({ ...form, dept_name: e.target.value })}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
        <div className="col-span-2">
          <label>Weekend</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {Weekdays.map((day) => (
              <button
                key={day}
                onClick={() => toggleWeekend(day)}
                className={`px-3 py-1 rounded ${
                  form.weekend.includes(day)
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
  );
};

export default EditDepartment;
