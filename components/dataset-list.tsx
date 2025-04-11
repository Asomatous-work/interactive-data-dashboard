"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Database, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

interface DatasetListProps {
  onSelectDataset?: (id: number) => void
}

export function DatasetList({ onSelectDataset }: DatasetListProps) {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const response = await fetch("/api/datasets")
        if (!response.ok) {
          throw new Error("Failed to fetch datasets")
        }
        const data = await response.json()
        setDatasets(data)
      } catch (err) {
        console.error("Error fetching datasets:", err)
        setError("Failed to load datasets")
      } finally {
        setLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  const handleViewDataset = (id: number) => {
    if (onSelectDataset) {
      onSelectDataset(id)
    } else {
      toast({
        title: "Feature coming soon",
        description: "Dataset visualization will be available in the next update.",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-[140px] mb-2" />
              <Skeleton className="h-4 w-[180px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-[100px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center h-[200px] text-red-500">{error}</div>
  }

  if (datasets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Datasets</CardTitle>
          <CardDescription>You haven't uploaded any datasets yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Use the "Upload CSV" button to add your first dataset.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {datasets.map((dataset: any, index: number) => {
        // Get a color based on the index
        const colorIndex = index % 8
        const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f97316", "#14b8a6", "#ec4899", "#eab308", "#ef4444"]
        const cardColor = colors[colorIndex]

        return (
          <Card key={dataset.id || index} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{dataset.name}</CardTitle>
                <Database className="h-5 w-5" style={{ color: cardColor }} />
              </div>
              <CardDescription>{dataset.description || "No description provided"}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Uploaded on {format(new Date(dataset.created_at), "MMM d, yyyy")}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleViewDataset(dataset.id)}
                className="w-full"
                variant="outline"
                style={{ borderColor: cardColor, color: cardColor }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Dataset
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
