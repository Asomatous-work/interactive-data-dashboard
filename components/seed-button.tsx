"use client"

import { useState } from "react"
import { Loader2, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false)
  const { toast } = useToast()

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch("/api/seed")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed database",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      toast({
        title: "Error",
        description: "Failed to seed database. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Button
      onClick={handleSeed}
      disabled={isSeeding}
      variant="outline"
      className="border-dashboard-teal text-dashboard-teal hover:bg-dashboard-teal hover:text-white"
    >
      {isSeeding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Seed Database
        </>
      )}
    </Button>
  )
}
