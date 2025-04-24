"use client";
import Modal from "@/components/modal";
import notificationToast from "@/components/notificationToast";
import {
  usePatchCreateDepartment,
  usePatchUpdateDepartment,
} from "@/services/Department/mutations";
import { useEffect, useState } from "react";

type EditDepartmentProps = {
  isOpen: boolean;
  onClose: () => void;
  department: {
    dept_id: number;
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

  useEffect(() => {
    setForm(department);
  }, [department]);

  const handleUpdate = () => {
    updateDept(form, {
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
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>ID (read-only)</label>
          <input
            type="text"
            value={form.dept_id}
            readOnly
            className="border px-4 py-2 w-full rounded bg-gray-100"
          />
        </div>
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
