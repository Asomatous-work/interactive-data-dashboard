"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDatasetData } from "@/app/actions"

// Color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#ff7300"]

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

  if (!datasetId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dataset Visualizer</CardTitle>
          <CardDescription>Select a dataset to visualize</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">No dataset selected</p>
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
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
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
          <p className="text-muted-foreground">No data available</p>
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
    }
  })

  return (
    <Card className="col-span-4 overflow-hidden">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxis} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yAxis} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {chartType === "line" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxis} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
          {chartType === "pie" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey={yAxis} nameKey={xAxis} cx="50%" cy="50%" outerRadius={150} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
