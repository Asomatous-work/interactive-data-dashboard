"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { colors } from "@/lib/colors"

export function Overview() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/revenue")
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data")
        }
        const revenueData = await response.json()
        setData(revenueData)
      } catch (err) {
        console.error("Error fetching revenue data:", err)
        setError("Failed to load revenue data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{`Month: ${label}`}</p>
          <p className="text-dashboard-blue font-semibold">{`Revenue: $${Number(payload[0].value).toLocaleString()}`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-dashboard-blue border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading revenue data...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-[350px] text-dashboard-red"
      >
        {error}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[350px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={8}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.blue} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.blue} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
          <XAxis
            dataKey="month"
            stroke={colors.muted}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: colors.border }}
            dy={10}
          />
          <YAxis
            stroke={colors.muted}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: colors.border }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value) => <span className="text-sm font-medium">{value}</span>}
          />
          <Bar
            dataKey="total"
            name="Revenue"
            fill="url(#colorRevenue)"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
            onMouseOver={(data, index) => setHoveredBar(index)}
            onMouseOut={() => setHoveredBar(null)}
          >
            {data.map((entry: any, index: number) => (
              <motion.rect
                key={`bar-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  fill: hoveredBar === index ? colors.blue : "url(#colorRevenue)",
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
