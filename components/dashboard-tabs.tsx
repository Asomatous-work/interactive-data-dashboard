"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatasetList } from "@/components/dataset-list"
import { DatasetVisualizer } from "@/components/dataset-visualizer"
import { colors } from "@/lib/colors"

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null)

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList className="bg-muted/50 p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-dashboard-blue data-[state=active]:text-white">
          Overview
        </TabsTrigger>
        <TabsTrigger value="sales" className="data-[state=active]:bg-dashboard-green data-[state=active]:text-white">
          Sales
        </TabsTrigger>
        <TabsTrigger value="finance" className="data-[state=active]:bg-dashboard-purple data-[state=active]:text-white">
          Finance
        </TabsTrigger>
        <TabsTrigger value="health" className="data-[state=active]:bg-dashboard-orange data-[state=active]:text-white">
          Health
        </TabsTrigger>
        <TabsTrigger value="datasets" className="data-[state=active]:bg-dashboard-teal data-[state=active]:text-white">
          My Datasets
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <TabsContent value="overview" className="space-y-4">
          {/* Content is rendered in the main page */}
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <motion.div
            key="sales"
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.green}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Monthly Sales</div>
              <div className="text-2xl font-bold" style={{ color: colors.green }}>
                $12,234
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.green}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Quarterly Sales</div>
              <div className="text-2xl font-bold" style={{ color: colors.green }}>
                $45,231
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.green}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Annual Sales</div>
              <div className="text-2xl font-bold" style={{ color: colors.green }}>
                $145,231
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.green}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Growth Rate</div>
              <div className="text-2xl font-bold" style={{ color: colors.green }}>
                +24.5%
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <motion.div
            key="finance"
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.purple}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Revenue</div>
              <div className="text-2xl font-bold" style={{ color: colors.purple }}>
                $45,231.89
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.purple}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Expenses</div>
              <div className="text-2xl font-bold" style={{ color: colors.purple }}>
                $12,234.45
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.purple}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Profit</div>
              <div className="text-2xl font-bold" style={{ color: colors.purple }}>
                $32,997.44
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.purple}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Profit Margin</div>
              <div className="text-2xl font-bold" style={{ color: colors.purple }}>
                72.9%
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <motion.div
            key="health"
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.orange}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Patient Count</div>
              <div className="text-2xl font-bold" style={{ color: colors.orange }}>
                2,345
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.orange}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Avg. Stay</div>
              <div className="text-2xl font-bold" style={{ color: colors.orange }}>
                3.2 days
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.orange}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Recovery Rate</div>
              <div className="text-2xl font-bold" style={{ color: colors.orange }}>
                94.5%
              </div>
            </motion.div>
            <motion.div
              className="rounded-xl border bg-card p-6 shadow overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              style={{ background: `linear-gradient(to bottom right, ${colors.orange}10, transparent)` }}
            >
              <div className="text-sm font-medium text-muted-foreground">Satisfaction</div>
              <div className="text-2xl font-bold" style={{ color: colors.orange }}>
                4.8/5
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-4">
          <motion.div
            key="datasets"
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
          >
            <div className="md:col-span-2 lg:col-span-3">
              <DatasetList onSelectDataset={setSelectedDatasetId} />
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <DatasetVisualizer datasetId={selectedDatasetId} />
            </div>
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  )
}
