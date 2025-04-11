"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const data = [
  { name: "Jan", revenue: 4000, profit: 2400, sales: 240 },
  { name: "Feb", revenue: 3000, profit: 1398, sales: 210 },
  { name: "Mar", revenue: 9800, profit: 2800, sales: 290 },
  { name: "Apr", revenue: 3908, profit: 2000, sales: 200 },
  { name: "May", revenue: 4800, profit: 2181, sales: 250 },
  { name: "Jun", revenue: 3800, profit: 2500, sales: 230 },
  { name: "Jul", revenue: 4300, profit: 2100, sales: 220 },
]

export function TrendChart() {
  const [activeTab, setActiveTab] = useState("line")

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Trend Analysis</CardTitle>
        <CardDescription>Visualize trends over time with different chart types</CardDescription>
        <Tabs defaultValue="line" className="w-[400px]" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {activeTab === "line" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                <Line type="monotone" dataKey="sales" stroke="#ffc658" name="Sales" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Profit" />
                <Area type="monotone" dataKey="sales" stackId="1" stroke="#ffc658" fill="#ffc658" name="Sales" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
