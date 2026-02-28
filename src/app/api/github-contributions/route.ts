import { NextResponse } from "next/server";

const GITHUB_USERNAME = "ankurkakroo2";
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { contributions: [], total: {} },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { contributions: [], total: {} },
      { status: 200 }
    );
  }
}
