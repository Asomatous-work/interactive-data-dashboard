"use server"

import { sql } from "@/lib/db"

export async function reseedRevenueData() {
  try {
    // Clear existing revenue data
    await sql`DELETE FROM revenue`

    // Seed revenue data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()

    // Generate some realistic revenue data with growth trend
    let baseRevenue = 10000
    for (let i = 0; i < months.length; i++) {
      // Add some randomness to the growth
      const randomFactor = 0.9 + Math.random() * 0.3 // Between 0.9 and 1.2
      baseRevenue = Math.round(baseRevenue * (1 + 0.05 * randomFactor)) // 5% monthly growth with randomness

      // Ensure we're inserting a number, not a string
      const revenueValue = Number(baseRevenue)

      await sql`
        INSERT INTO revenue (month, year, total) VALUES 
        (${months[i]}, ${currentYear}, ${revenueValue})
      `
    }

    return { success: true, message: "Revenue data reseeded successfully" }
  } catch (error) {
    console.error("Error reseeding revenue data:", error)
    return { success: false, error: "Failed to reseed revenue data" }
  }
}
