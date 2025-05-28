import React, { useState } from "react";
import { useToggleEmployeeStatus , useDeleteEmployee } from "@/services/mutations"; 
import { UserProfileDataType } from "@/services/types"; 
import notificationToast from "@/components/notificationToast";
import { FiTrash } from "react-icons/fi"; 
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/modal";

interface GuestRowProps {
  guest: UserProfileDataType; 
}

const GuestRow: React.FC<GuestRowProps> = ({ guest }) => {
  
 

  const queryClient = useQueryClient();
  const { mutate } = useToggleEmployeeStatus();
  const { mutate:deleteEmployee } = useDeleteEmployee();

  const [showDeleteModal, setShowDeleteModal] = useState(false);



 const handleToggle = () => {
    const newStatus = !guest.is_active;
  
   
    
    if (guest.employee_id !== undefined) {
        mutate({
          employeeId: guest.employee_id,
          isActive: newStatus,
        },
        {
            onSuccess:()=>{
                notificationToast("Active Status updated!","success");
                queryClient.invalidateQueries({ queryKey: ["guests"] });
                
            }
        ,
        
            onError:()=>{
                notificationToast("An Error Occurred","error")
            }
        }
    );
      }
  };

  

  const handleDelete = () => {

    if (guest.employee_id !== undefined) {
      deleteEmployee(guest.employee_id,
      {
          onSuccess:()=>{
              notificationToast("Guest Deleted Successfully!","success");
          }
      ,
      
          onError:()=>{
              notificationToast("An Error Occurred","error")
          }
      }
    );
    }

  }
    
 




  return (
    <>
    <tr>
      <td className="border px-4 py-2 text-center">{guest.name}</td>
      <td className="border px-4 py-2 text-center">
        <input
          type="checkbox"
          className={`toggle border-white bg-white hover:bg-white ${
            guest.is_active ? "[--tglbg:#00aa68]" : "[--tglbg:#d73545]"
          }`}
          checked={guest.is_active}
          onChange={handleToggle} 
        />
      </td>
      <td className="border px-4 py-2 text-center">
        <button
          onClick={()=>setShowDeleteModal(true)}
         // disabled={isDeleting}
          className="text-red-600 hover:text-red-800"
          title="Delete Guest"
        >
          <FiTrash size={18} />
        </button>
      </td>
    </tr>

    {/* Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
          <p className="mb-6">
            Do you want to delete <strong>{guest.name}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              No
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )}
  </>
    



  );

  
  


};

export default GuestRow;
