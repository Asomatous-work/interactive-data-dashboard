"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Fallback static data in case the API call fails
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
            setData(revenueData)
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow rounded">
          <p className="text-sm font-semibold">{`${label}`}</p>
          <p className="text-sm">{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="total" name="Revenue" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
