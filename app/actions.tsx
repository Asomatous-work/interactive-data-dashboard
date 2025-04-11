"use server"

import { sql } from "@/lib/db"

export async function getDatasetData(datasetId: number) {
  try {
    const [dataset] = await sql`
      SELECT id, name, description, columns 
      FROM uploaded_datasets 
      WHERE id = ${datasetId}
    `

    if (!dataset) {
      return { success: false, error: "Dataset not found" }
    }

    const rows = await sql`
      SELECT row_data 
      FROM dataset_rows 
      WHERE dataset_id = ${datasetId}
    `

    const data = rows.map((row) => row.row_data)

    return { success: true, dataset, data }
  } catch (error) {
    console.error("Error fetching dataset data:", error)
    return { success: false, error: "Failed to fetch dataset data" }
  }
}
