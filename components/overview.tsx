"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Static fallback data
const fallbackData = [
  { month: "Jan", total: 10500 },
  { month: "Feb", total: 12000 },
  { month: "Mar", total: 15000 },
  { month: "Apr", total: 12500 },
  { month: "May", total: 13000 },
  { month: "Jun", total: 14500 },
  { month: "Jul", total: 16000 },
  { month: "Aug", total: 18000 },
  { month: "Sep", total: 17000 },
  { month: "Oct", total: 19000 },
  { month: "Nov", total: 21000 },
  { month: "Dec", total: 22000 },
]

export function Overview() {
  const [data, setData] = useState(fallbackData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/revenue")
        if (response.ok) {
          const revenueData = await response.json()
          if (revenueData && revenueData.length > 0) {
            // Ensure data is properly formatted
            const formattedData = revenueData.map((item) => ({
              month: item.month,
              total: typeof item.total === "string" ? Number.parseFloat(item.total) : item.total,
            }))
            setData(formattedData)
          }
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="h-[350px] flex items-center justify-center">Loading...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
        <Legend />
        <Bar dataKey="total" name="Revenue" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
