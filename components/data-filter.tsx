"use client"

import { useState } from "react"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DataFilter() {
  const [dateRange, setDateRange] = useState("30d")
  const [showRevenue, setShowRevenue] = useState(true)
  const [showSales, setShowSales] = useState(true)
  const [showProfit, setShowProfit] = useState(true)

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Data to Display</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={showRevenue} onCheckedChange={setShowRevenue}>
            Revenue
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showSales} onCheckedChange={setShowSales}>
            Sales
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showProfit} onCheckedChange={setShowProfit}>
            Profit
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
          <SelectItem value="1y">Last year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
