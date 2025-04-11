import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const revenue = await sql`SELECT * FROM revenue ORDER BY year, CASE 
      WHEN month = 'Jan' THEN 1
      WHEN month = 'Feb' THEN 2
      WHEN month = 'Mar' THEN 3
      WHEN month = 'Apr' THEN 4
      WHEN month = 'May' THEN 5
      WHEN month = 'Jun' THEN 6
      WHEN month = 'Jul' THEN 7
      WHEN month = 'Aug' THEN 8
      WHEN month = 'Sep' THEN 9
      WHEN month = 'Oct' THEN 10
      WHEN month = 'Nov' THEN 11
      WHEN month = 'Dec' THEN 12
    END ASC`
    return NextResponse.json(revenue)
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 })
  }
}
