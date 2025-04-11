import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const kpis = await sql`SELECT * FROM kpi ORDER BY id ASC`
    return NextResponse.json(kpis)
  } catch (error) {
    console.error("Error fetching KPIs:", error)
    return NextResponse.json({ error: "Failed to fetch KPIs" }, { status: 500 })
  }
}
