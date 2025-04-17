import React, { useState } from "react";
import { useToggleEmployeeStatus } from "@/services/mutations"; 
import { UserProfileDataType } from "@/services/types"; 
import notificationToast from "@/components/notificationToast";

interface GuestRowProps {
  guest: UserProfileDataType; 
}

const GuestRow: React.FC<GuestRowProps> = ({ guest }) => {
  
  const [isActive, setIsActive] = useState(guest.is_active);

  
  const { mutate } = useToggleEmployeeStatus();


  const handleToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus); 

    
    if (guest.employee_id !== undefined) {
        mutate({
          employeeId: guest.employee_id,
          isActive: newStatus,
        },
        {
            onSuccess:()=>{
                notificationToast("Active Status updated!","success");
            }
        ,
        
            onError:()=>{
                notificationToast("An Error Occurred","error")
            }
        }
    );
      }
  };

  return (
    <tr>
      <td className="border px-4 py-2 text-center">{guest.name}</td>
      <td className="border px-4 py-2 text-center">
        <input
          type="checkbox"
          className={`toggle border-white bg-white hover:bg-white ${
            isActive ? "[--tglbg:#00aa68]" : "[--tglbg:#d73545]"
          }`}
          checked={isActive}
          onChange={handleToggle} 
        />
      </td>
    </tr>
  );
};

export default GuestRow;
