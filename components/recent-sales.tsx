"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { colors } from "@/lib/colors"

export function RecentSales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/sales")
        if (!response.ok) {
          throw new Error("Failed to fetch sales data")
        }
        const salesData = await response.json()
        setSales(salesData)
      } catch (err) {
        console.error("Error fetching sales data:", err)
        setError("Failed to load sales data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="ml-auto h-4 w-[60px]" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-[200px] text-dashboard-red"
      >
        {error}
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <div className="space-y-8">
        {sales.map((sale: any, index: number) => (
          <motion.div
            key={sale.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center"
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Avatar className="h-9 w-9 border-2 border-transparent transition-colors duration-300">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback
                  style={{
                    backgroundColor: `${colors.purple}20`,
                    color: colors.purple,
                  }}
                >
                  {sale.customer_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="ml-4 space-y-1">
              <motion.p
                className="text-sm font-medium leading-none"
                animate={{
                  color: hoveredItem === index ? colors.purple : "hsl(var(--foreground))",
                }}
              >
                {sale.customer_name}
              </motion.p>
              <p className="text-sm text-muted-foreground">{sale.customer_email}</p>
            </div>
            <motion.div
              className="ml-auto font-medium"
              animate={{
                scale: hoveredItem === index ? 1.05 : 1,
              }}
              style={{ color: colors.green }}
            >
              +${Number(sale.amount).toFixed(2)}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
