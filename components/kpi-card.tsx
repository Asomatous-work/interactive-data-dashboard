"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
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
  isLoading?: boolean
  colorIndex?: number
}

export function KpiCard({
  title,
  value,
  changePercentage,
  period,
  icon,
  prefix = "",
  isLoading = false,
  colorIndex = 0,
}: KpiCardProps) {
  const [isHovered, setIsHovered] = useState(false)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn("transition-all duration-300 border-2 overflow-hidden", isHovered ? "shadow-lg" : "shadow")}
        style={{
          borderColor: isHovered ? cardColor : "transparent",
          background: `linear-gradient(to bottom right, ${cardColor}10, transparent)`,
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <motion.div
            animate={isHovered ? { rotate: [0, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground"
            style={{ color: cardColor }}
          >
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold" style={{ color: cardColor }}>
              <AnimatedCounter from={0} to={value} duration={1.5} formatValue={formatValue} />
            </div>
          )}
          <div className="flex items-center mt-1">
            <div
              className={cn("flex items-center text-xs", isPositive ? "text-dashboard-green" : "text-dashboard-red")}
            >
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
    </motion.div>
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
