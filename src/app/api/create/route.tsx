import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const { name, email, password, dept_id, remarks, status } = body;

    // Validate input
    if (!name || !email || !password || !dept_id || typeof status !== 'boolean') {
      return NextResponse.json(
        { message: 'All fields (name, email, password, dept_id, status) are required, and status must be true or false' },
        { status: 400 }
      );
    }

    // Replace 'YOUR_API_TOKEN' with the actual token provided by the external API
    //const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdmFzb2Z0QGdtYWlsLmNvbSIsImVtcGxveWVlX2lkIjoxLCJleHAiOjE3MzUzNzQzMTAsImlzX2FkbWluIjp0cnVlfQ.307XPKwtBhk8LUgyB8KL5-v9l4bht6v4InRH6VbB4IY';

    // Forward the request to the external API
    const response = await fetch('http://46.137.193.141:50000/employee?=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdmFzb2Z0QGdtYWlsLmNvbSIsImVtcGxveWVlX2lkIjoxLCJleHAiOjE3MzU4MDI4NjYsImlzX2FkbWluIjp0cnVlfQ.XomdnczTQJOdJRAe9b0vKJMwH_yIPTFgsFqKjSsWeA0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdmFzb2Z0QGdtYWlsLmNvbSIsImVtcGxveWVlX2lkIjoxLCJleHAiOjE3MzU4MDI4NjYsImlzX2FkbWluIjp0cnVlfQ.XomdnczTQJOdJRAe9b0vKJMwH_yIPTFgsFqKjSsWeA0`, // Add the Authorization header
      },
      body: JSON.stringify({ name, email, password, dept_id, remarks, status }),
    });

    // Handle the external API response
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const errorText = await response.text();
      return NextResponse.json({ message: errorText }, { status: response.status });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
