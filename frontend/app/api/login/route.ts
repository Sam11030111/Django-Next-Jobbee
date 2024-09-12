import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json(); // Parse request body

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
        username,
        password,
      },{
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.access) {
      cookies().set('accessToken', response.data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 15,
        sameSite: 'lax',
      });
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response?.data?.error || "An error occurred",
      },
      { status: error.response?.status || 500 }
    );
  }
}


