"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { colors } from "@/lib/colors"

export function RecentSales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    return <div className="flex justify-center items-center h-[200px] text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      {sales.map((sale: any, index: number) => (
        <div key={sale.id || index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback
              style={{
                backgroundColor: `${colors.purple}20`,
                color: colors.purple,
              }}
            >
              {sale.customer_name
                ? sale.customer_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                : ""}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer_name}</p>
            <p className="text-sm text-muted-foreground">{sale.customer_email}</p>
          </div>
          <div className="ml-auto font-medium" style={{ color: colors.green }}>
            +${Number(sale.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
