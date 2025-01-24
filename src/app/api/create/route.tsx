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

    

    // Forward the request to the external API
    const response = await fetch('http://46.137.193.141:50000/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
