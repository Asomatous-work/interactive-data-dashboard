"use client"

import type React from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { cn } from "@/lib/utils"
import { colors } from "@/lib/colors"

interface KpiCardProps {
  title: string
  value: number
  changePercentage: number
  period: string
  icon: React.ReactNode
  prefix?: string
  colorIndex?: number
}

export function KpiCard({ title, value, changePercentage, period, icon, prefix = "", colorIndex = 0 }: KpiCardProps) {
  const isPositive = changePercentage >= 0

  // Get a color based on the index
  const cardColor = getCategoryColor(colorIndex)

  const formatValue = (val: number) => {
    if (prefix === "$") {
      return `${prefix}${val.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    }
    return val.toLocaleString("en-US")
  }

  return (
    <Card className="border-2 border-transparent hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <AnimatedCounter from={0} to={value} duration={1.5} formatValue={formatValue} />
        </div>
        <div className="flex items-center mt-1">
          <div className={cn("flex items-center text-xs", isPositive ? "text-dashboard-green" : "text-dashboard-red")}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            <span>
              {isPositive ? "+" : ""}
              {changePercentage}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground ml-1">{period}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get a color based on index
function getCategoryColor(index: number): string {
  const palette = [
    colors.blue,
    colors.green,
    colors.purple,
    colors.orange,
    colors.teal,
    colors.pink,
    colors.yellow,
    colors.red,
  ]
  return palette[index % palette.length]
}
