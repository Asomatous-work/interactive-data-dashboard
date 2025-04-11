import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sales = await sql`SELECT * FROM sales ORDER BY date DESC LIMIT 5`
    return NextResponse.json(sales)
  } catch (error) {
    console.error("Error fetching sales data:", error)
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 })
  }
}
