'use client'
import { useState } from 'react'

export default function Home() {
   
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const submitData = async () => {
        let response = await fetch('/api/proxy_login', {
            method: 'POST',
            body: JSON.stringify({
              email:'vivasoft@gmail.com',
              password:'1234',
          
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        
        const text = await response.text()
        console.log(text)
        //response = await response.json()

        //alert(JSON.stringify(response))
        //console.log(JSON.stringify(response))
    }

    return (
        <>
            <h2>External Post API Request | GeeksForGeeks</h2>
            <input
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Enter email'
            />
            
<input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter password'
            />

           
            <button onClick={submitData}>Submit</button>
        </>
    )
}