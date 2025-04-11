"use client"

import { useState } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { reseedRevenueData } from "@/app/actions/reseed-revenue"

export function ReseedRevenueButton() {
  const [isReseeding, setIsReseeding] = useState(false)
  const { toast } = useToast()

  const handleReseed = async () => {
    setIsReseeding(true)
    try {
      const result = await reseedRevenueData()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Reload the page to show the new data
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reseed revenue data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error reseeding revenue data:", error)
      toast({
        title: "Error",
        description: "Failed to reseed revenue data. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setIsReseeding(false)
    }
  }

  return (
    <Button
      onClick={handleReseed}
      disabled={isReseeding}
      variant="outline"
      className="border-dashboard-orange text-dashboard-orange hover:bg-dashboard-orange hover:text-white"
    >
      {isReseeding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Reseeding...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reseed Revenue Data
        </>
      )}
    </Button>
  )
}
