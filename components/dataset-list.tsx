"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Database, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { colors } from "@/lib/colors"

interface DatasetListProps {
  onSelectDataset?: (id: number) => void
}

export function DatasetList({ onSelectDataset }: DatasetListProps) {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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

  if (datasets.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>No Datasets</CardTitle>
            <CardDescription>You haven't uploaded any datasets yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Use the "Upload CSV" button to add your first dataset.</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {datasets.map((dataset: any, index: number) => {
        // Get a color based on the index
        const cardColor = getCategoryColor(index)

        return (
          <motion.div
            key={dataset.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onHoverStart={() => setHoveredCard(dataset.id)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card
              className={`h-full flex flex-col transition-shadow duration-300 overflow-hidden ${
                hoveredCard === dataset.id ? "shadow-lg" : ""
              }`}
              style={{
                borderColor: hoveredCard === dataset.id ? cardColor : undefined,
                background: `linear-gradient(to bottom right, ${cardColor}10, transparent)`,
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{dataset.name}</CardTitle>
                  <Database className="h-5 w-5 transition-colors duration-300" style={{ color: cardColor }} />
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
                  className="w-full transition-all duration-300"
                  variant={hoveredCard === dataset.id ? "default" : "outline"}
                  style={
                    hoveredCard === dataset.id
                      ? { backgroundColor: cardColor, borderColor: cardColor }
                      : { borderColor: cardColor, color: cardColor }
                  }
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Dataset
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )
      })}
    </div>
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
