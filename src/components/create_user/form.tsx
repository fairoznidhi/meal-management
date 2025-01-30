"use client"
import { DialogHTMLAttributes } from "react"
import Input from "../input"
const Form=()=>{
    return(
<div>
{/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn bg-[#2fa5ed] hover:bg-[#0187DA]" onClick={()=>(document.getElementById('my_modal_2') as HTMLDialogElement)?.showModal()}>Add New Employee</button>
<dialog id="my_modal_2" className="modal">
  <div className="modal-box h-auto w-full mx-20 my-20">
    <p className="text-2xl mb-10">Create New User Account</p>
    <form className="text-xl text-left items-center justify-center gap-x-4 mb-5">
    <Input
        label="Username"
        id="username"
        placeholder="Enter your username"
        onChange={(e) => console.log(e.target.value)}
      />
        <br></br>
        <Input
        label="Password"
        id="password"
        type="password"
        placeholder="Enter your password"
        togglePasswordVisibility={true}
        onChange={(e) => console.log(e.target.value)}
      />
        <br></br>
        <Input
        label="Email"
        id="Email"
        placeholder="Enter your Email"
        onChange={(e) => console.log(e.target.value)}
      />
        <br></br>
        <Input
        label="Phone No."
        id="Phone"
        placeholder="Enter your Phone No."
        onChange={(e) => console.log(e.target.value)}
      />
        <br></br>
        <label className="me-5 mb-5">Dept.</label>
        <details className="dropdown ms-10">
  <summary className="btn m-1">Choose Dept.</summary>
  <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    <li><a>Development</a></li>
    <li><a>Call Center</a></li>
  </ul>
</details>

        <div className="modal-action">
      <form method="dialog">
        {/* if there is a button, it will close the modal */}
        <button className="btn">Create acoount</button>
      </form>
    </div>
        

    </form>
  </div>

</dialog>
</div>
    )
}

export default Form