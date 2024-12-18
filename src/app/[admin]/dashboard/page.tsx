import WeekCalendar from "@/components/WeekCalendar";
import Total_table from "@/components/total_table";
import Total_box from "@/components/total_box";
const dashboard=()=>{
    return (
        <div className="ms-20 mt-20 mb-5 items-center justify-center">
        <Total_box></Total_box>
       <WeekCalendar></WeekCalendar>
       <div className="mt-12">
         <Total_table></Total_table>
       </div>
      </div>
     
    );
}
export default dashboard