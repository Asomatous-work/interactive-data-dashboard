"use server"

import { sql } from "@/lib/db"

export async function seedInitialData() {
  try {
    // Check if we already have data
    const kpiCount = await sql`SELECT COUNT(*) FROM kpi`
    if (Number.parseInt(kpiCount[0].count) > 0) {
      console.log("Database already has data, skipping seed")
      return { success: true, message: "Database already has data" }
    }

    // Seed KPI data
    await sql`
      INSERT INTO kpi (name, value, change_percentage, period) VALUES 
      ('Total Revenue', 45231.89, 20.1, 'last month'),
      ('Subscriptions', 2350, 180.1, 'last month'),
      ('Sales', 12234, 19, 'last month'),
      ('Active Now', 573, 201, 'last hour')
    `

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

    // Seed sales data
    const customers = [
      { name: "Olivia Martin", email: "olivia.martin@example.com", amount: 1999.0, product: "Premium Plan" },
      { name: "Jackson Lee", email: "jackson.lee@example.com", amount: 39.0, product: "Basic Plan" },
      { name: "Isabella Nguyen", email: "isabella.nguyen@example.com", amount: 299.0, product: "Pro Plan" },
      { name: "William Kim", email: "will@example.com", amount: 99.0, product: "Standard Plan" },
      { name: "Sofia Davis", email: "sofia.davis@example.com", amount: 39.0, product: "Basic Plan" },
      { name: "Ethan Johnson", email: "ethan.j@example.com", amount: 149.0, product: "Pro Plan" },
      { name: "Emma Wilson", email: "emma.w@example.com", amount: 1299.0, product: "Enterprise Plan" },
      { name: "Noah Garcia", email: "noah.g@example.com", amount: 59.0, product: "Standard Plan" },
      { name: "Ava Martinez", email: "ava.m@example.com", amount: 39.0, product: "Basic Plan" },
      { name: "Liam Taylor", email: "liam.t@example.com", amount: 299.0, product: "Pro Plan" },
    ]

    // Insert sales with dates spanning the last 10 days
    for (let i = 0; i < customers.length; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i) // Each sale is one day older

      await sql`
        INSERT INTO sales (date, amount, customer_name, customer_email, product) VALUES 
        (${date.toISOString().split("T")[0]}, ${customers[i].amount}, ${customers[i].name}, ${customers[i].email}, ${customers[i].product})
      `
    }

    // Create a sample dataset
    const sampleDatasetColumns = ["month", "sales", "expenses", "profit"]

    await sql`
      INSERT INTO uploaded_datasets (name, description, columns) VALUES 
      ('Sample Financial Data', 'A sample dataset with monthly financial metrics', ${JSON.stringify(sampleDatasetColumns)})
      RETURNING id
    `

    // Get the dataset ID
    const datasetResult = await sql`SELECT id FROM uploaded_datasets ORDER BY id DESC LIMIT 1`
    const datasetId = datasetResult[0].id

    // Create sample rows for the dataset
    const sampleData = [
      { month: "January", sales: 45000, expenses: 32000, profit: 13000 },
      { month: "February", sales: 52000, expenses: 34000, profit: 18000 },
      { month: "March", sales: 49000, expenses: 33000, profit: 16000 },
      { month: "April", sales: 58000, expenses: 36000, profit: 22000 },
      { month: "May", sales: 55000, expenses: 35000, profit: 20000 },
      { month: "June", sales: 62000, expenses: 38000, profit: 24000 },
    ]

    for (const row of sampleData) {
      await sql`
        INSERT INTO dataset_rows (dataset_id, row_data) VALUES 
        (${datasetId}, ${JSON.stringify(row)})
      `
    }

    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error: "Failed to seed database" }
  }
}
