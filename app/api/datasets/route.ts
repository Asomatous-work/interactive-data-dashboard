import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, description, columns, data } = await request.json()

    // Create a new dataset entry
    const [dataset] = await sql`
      INSERT INTO uploaded_datasets (name, description, columns)
      VALUES (${name}, ${description || null}, ${JSON.stringify(columns)})
      RETURNING id
    `

    // Insert all rows
    if (data && data.length > 0) {
      const datasetId = dataset.id

      // Batch insert rows in chunks to avoid query size limits
      const chunkSize = 100
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize)
        const values = chunk.map((row: any) => `(${datasetId}, ${JSON.stringify(row)})`)

        if (values.length > 0) {
          await sql.unsafe(`
            INSERT INTO dataset_rows (dataset_id, row_data)
            VALUES ${values.join(", ")}
          `)
        }
      }
    }

    return NextResponse.json({ success: true, message: "Dataset uploaded successfully" })
  } catch (error) {
    console.error("Error saving dataset:", error)
    return NextResponse.json({ error: "Failed to save dataset" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const datasets = await sql`
      SELECT id, name, description, created_at 
      FROM uploaded_datasets 
      ORDER BY created_at DESC
    `
    return NextResponse.json(datasets)
  } catch (error) {
    console.error("Error fetching datasets:", error)
    return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 })
  }
}
