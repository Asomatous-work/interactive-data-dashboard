import { NextResponse } from "next/server"
import { seedInitialData } from "@/app/actions/seed-data"

export async function GET() {
  try {
    const result = await seedInitialData()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
