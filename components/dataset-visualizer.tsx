"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDatasetData } from "@/app/actions"
import { colors, getDatasetColors } from "@/lib/colors"

interface DatasetVisualizerProps {
  datasetId: number | null
}

export function DatasetVisualizer({ datasetId }: DatasetVisualizerProps) {
  const [dataset, setDataset] = useState<any>(null)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [chartType, setChartType] = useState("bar")
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [columns, setColumns] = useState<string[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!datasetId) return

    async function fetchDatasetData() {
      setLoading(true)
      try {
        const result = await getDatasetData(datasetId)
        if (result.success) {
          setDataset(result.dataset)
          setData(result.data)

          // Set columns from the dataset
          const cols = result.dataset.columns
          setColumns(cols)

          // Set default x and y axis if available
          if (cols.length > 0) {
            setXAxis(cols[0])
            if (cols.length > 1) {
              setYAxis(cols[1])
            } else {
              setYAxis(cols[0])
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dataset data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDatasetData()
  }, [datasetId])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{`${xAxis}: ${label}`}</p>
          <p className="text-dashboard-blue font-semibold">{`${yAxis}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  if (!datasetId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dataset Visualizer</CardTitle>
          <CardDescription>Select a dataset to visualize</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground">
            No dataset selected
          </motion.p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Dataset</CardTitle>
          <CardDescription>Please wait...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1.5,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              },
            }}
            className="h-12 w-12 rounded-full border-4 border-t-transparent"
            style={{ borderColor: colors.blue }}
          />
        </CardContent>
      </Card>
    )
  }

  if (!dataset || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dataset Error</CardTitle>
          <CardDescription>Could not load dataset or dataset is empty</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground">
            No data available
          </motion.p>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for visualization
  const chartData = data.map((item, index) => {
    // For numeric values, convert to number
    const yValue = isNaN(Number(item[yAxis])) ? item[yAxis] : Number(item[yAxis])
    return {
      [xAxis]: item[xAxis],
      [yAxis]: yValue,
      index,
    }
  })

  // Get colors for the dataset
  const dataColors = getDatasetColors(chartData.length)

  // Create unique IDs for the gradients
  const barGradientId = "barGradient"
  const lineGradientId = "lineGradient"

  return (
    <Card className="col-span-4 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <CardHeader>
          <CardTitle>{dataset.name}</CardTitle>
          <CardDescription>{dataset.description || "Dataset visualization"}</CardDescription>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="w-full sm:w-auto">
              <Tabs value={chartType} onValueChange={setChartType}>
                <TabsList>
                  <TabsTrigger value="bar">Bar</TabsTrigger>
                  <TabsTrigger value="line">Line</TabsTrigger>
                  <TabsTrigger value="pie">Pie</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-wrap gap-2 ml-auto">
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="X Axis" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Y Axis" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.blue} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.blue} stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={xAxis} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey={yAxis}
                    fill={`url(#${barGradientId})`}
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    onMouseOver={(data) => setHoveredIndex(data.index)}
                    onMouseOut={() => setHoveredIndex(null)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={hoveredIndex === index ? colors.blue : `url(#${barGradientId})`}
                        cursor="pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id={lineGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.purple} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.purple} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xAxis} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={yAxis}
                    stroke={colors.purple}
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: "var(--background)",
                      stroke: colors.purple,
                    }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 0,
                      fill: colors.purple,
                    }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {chartType === "pie" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey={yAxis}
                    nameKey={xAxis}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    label
                    labelLine
                    onMouseOver={(_, index) => setHoveredIndex(index)}
                    onMouseOut={() => setHoveredIndex(null)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={dataColors[index % dataColors.length]}
                        stroke="var(--background)"
                        strokeWidth={hoveredIndex === index ? 2 : 1}
                        style={{
                          filter: hoveredIndex === index ? "drop-shadow(0 0 4px rgba(0,0,0,0.3))" : "none",
                          cursor: "pointer",
                          opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.7,
                          transition: "opacity 0.3s, filter 0.3s, stroke-width 0.3s",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </motion.div>
    </Card>
  )
}
