"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    if (!datasetName.trim()) {
      toast({
        title: "Dataset name required",
        description: "Please provide a name for your dataset",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Parse CSV file
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        if (results.data.length === 0 || !results.meta.fields || results.meta.fields.length === 0) {
          toast({
            title: "Invalid CSV file",
            description: "The CSV file is empty or has no headers",
            variant: "destructive",
          })
          setIsUploading(false)
          return
        }

        try {
          // Save to database
          const response = await fetch("/api/datasets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: datasetName,
              description: datasetDescription,
              columns: results.meta.fields,
              data: results.data,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to save dataset")
          }

          const result = await response.json()

          toast({
            title: "File uploaded successfully",
            description: `Uploaded ${file.name} with ${results.data.length} rows of data`,
          })

          setIsUploading(false)
          setOpen(false)
          setFile(null)
          setDatasetName("")
          setDatasetDescription("")
        } catch (error) {
          console.error("Error saving dataset:", error)
          toast({
            title: "Error uploading file",
            description: "There was an error saving your dataset. Please try again.",
            variant: "destructive",
          })
          setIsUploading(false)
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error)
        toast({
          title: "Error uploading file",
          description: "There was an error parsing your CSV file. Please check the format and try again.",
          variant: "destructive",
        })
        setIsUploading(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Data</DialogTitle>
          <DialogDescription>Upload a CSV file to visualize your custom data in the dashboard.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="datasetName" className="col-span-4">
              Dataset Name
            </Label>
            <Input
              id="datasetName"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              className="col-span-4"
              placeholder="e.g., Sales Q1 2023"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="datasetDescription" className="col-span-4">
              Description (Optional)
            </Label>
            <Input
              id="datasetDescription"
              value={datasetDescription}
              onChange={(e) => setDatasetDescription(e.target.value)}
              className="col-span-4"
              placeholder="Brief description of this dataset"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="col-span-4">
              CSV File
            </Label>
            <Input id="file" type="file" accept=".csv" onChange={handleFileChange} className="col-span-4" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
