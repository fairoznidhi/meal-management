import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://46.137.193.141:50000/employee?employee_id=1');
    
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch employee data' }, { status: response.status });
    }

    const employees = await response.json();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}