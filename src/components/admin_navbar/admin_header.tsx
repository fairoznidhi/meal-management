"use client"
import SearchBar from "./searchbar"
import Sidebar from "../sidebar"

const Admin_Header=()=>{
    return(
      <div className="flex gap-x-96">
        <div>
            
        </div>
        <div className="ms-28">
            <SearchBar></SearchBar>
        </div>
      </div>
    );
}
export default Admin_Header