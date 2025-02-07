import React, { useState } from 'react';
import Modal from '@/components/modal';
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import notificationToast from '@/components/notificationToast';

const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
interface DepartmentModalProps {
  showDeptModal: boolean;
  setShowDeptModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}

type Dept={
    dept_id:number,
    dept_name:string,
    weekends:string[],
  }
  
const fetchDept=async()=>{
    try{
      const dept=await request({
        url:"/dept",
        method:"GET",
        useAuth:true,
      });
      return dept as Dept[];
    }catch (err: any) {
      console.error("Error fetching depts:", err);
      return [];
  }
  };





const DepartmentModal: React.FC<DepartmentModalProps> = ({
    showDeptModal,
    setShowDeptModal,
    resetForm,
  }) => {
    const initialDeptState = {
      dept_id: '',
      dept_name: '',
      weekend: [] as string[],
    };
  
    const [newDept, setNewDept] = useState(initialDeptState);
    const [departments, setDepartments] = useState<Dept[]>([]);
    const handleAddWeekend = (day: string) => {
      setNewDept((prev) => ({
        ...prev,
        weekend: [...prev.weekend, day],
      }));
    };
  
    const handleRemoveWeekend = (day: string) => {
      setNewDept((prev) => ({
        ...prev,
        weekend: prev.weekend.filter((weekend) => weekend !== day),
      }));
    };
  
    const resetDepartmentForm = () => {
      setNewDept(initialDeptState);
    };
  
    const addDepartment = async () => {
      const { dept_id, dept_name, weekend } = newDept;
      const data = {
        dept_id: parseInt(dept_id, 10) || 0,
        dept_name,
        weekend,
      };
  
      try {
        const response = await request({
          url: '/dept',
          method: 'POST',
          data: data,
          useAuth: true,
        }) as any;
  
        if (response=="New Department is created successfully") {
          //alert('Department added successfully!');
          notificationToast("Department added successfully","success");
          resetDepartmentForm();
          setShowDeptModal(false);
          const deptList=await fetchDept();
          setDepartments(deptList);
        }
      } catch (error) {
        notificationToast("Invalid Department Id","error");
        console.error('API request error:', error);
      }
    };
  
    return (
      <Modal
        isOpen={showDeptModal}
        onClose={() => {
          setShowDeptModal(false);
          resetDepartmentForm();
        }}
        title="Add New Department"
        footer={
          <>
            <button
              onClick={() => {
                setShowDeptModal(false);
                resetDepartmentForm();
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={addDepartment}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Department ID:</label>
            <input
              type="text"
              value={newDept.dept_id}
              onChange={(e) => setNewDept({ ...newDept, dept_id: e.target.value })}
              className="border px-4 py-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Department Name:</label>
            <input
              type="text"
              value={newDept.dept_name}
              onChange={(e) => setNewDept({ ...newDept, dept_name: e.target.value })}
              className="border px-4 py-2 w-full rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2">Weekends:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAddWeekend('Friday')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Friday
              </button>
              <button
                onClick={() => handleAddWeekend('Saturday')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Saturday
              </button>
              <button
                onClick={() => handleAddWeekend('Sunday')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Sunday
              </button>
            </div>
            <div className="mt-2">
              {newDept.weekend.map((day) => (
                <div key={day} className="inline-flex items-center mr-2">
                  <span>{day}</span>
                  <button
                    onClick={() => handleRemoveWeekend(day)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  export default DepartmentModal;