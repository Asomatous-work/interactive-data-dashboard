import { FileUpload } from "@/components/file-upload"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { KpiCard } from "@/components/kpi-card"
import { seedInitialData } from "@/app/actions/seed-data"
import { sql } from "@/lib/db"
import { DollarSign, Users, CreditCard, Activity } from "lucide-react"

// This function will seed the database with initial data if needed
async function ensureDataExists() {
  await seedInitialData()
}

// Fetch KPI data from the database
async function getKpiData() {
  try {
    const kpis = await sql`SELECT * FROM kpi ORDER BY id ASC`
    return kpis
  } catch (error) {
    console.error("Failed to fetch KPI data:", error)
    return []
  }
}

export default async function DashboardPage() {
  // Ensure we have data in the database
  await ensureDataExists()

  // Fetch KPI data
  const kpiData = await getKpiData()

  // Map icons to KPI types
  const getIconForKpi = (name: string) => {
    if (name.includes("Revenue")) return <DollarSign className="h-4 w-4" />
    if (name.includes("Subscriptions")) return <Users className="h-4 w-4" />
    if (name.includes("Sales")) return <CreditCard className="h-4 w-4" />
    if (name.includes("Active")) return <Activity className="h-4 w-4" />
    return <DollarSign className="h-4 w-4" />
  }

  // Determine if a KPI should have a dollar sign
  const shouldHaveDollarSign = (name: string) => {
    return name.includes("Revenue") || name.includes("Sales")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <FileUpload />
            <Button>Download</Button>
          </div>
        </div>
        <DashboardTabs />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi: any, index: number) => (
            <KpiCard
              key={kpi.id}
              title={kpi.name}
              value={Number(kpi.value)}
              changePercentage={Number(kpi.change_percentage)}
              period={kpi.period}
              icon={getIconForKpi(kpi.name)}
              prefix={shouldHaveDollarSign(kpi.name) ? "$" : ""}
              colorIndex={index}
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
