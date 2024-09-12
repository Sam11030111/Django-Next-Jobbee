import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const token = cookies().get('accessToken')?.value;;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });    

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.detail || 'Error fetching user data' },
      { status: error.response?.status || 500 }
    );
  }
}
