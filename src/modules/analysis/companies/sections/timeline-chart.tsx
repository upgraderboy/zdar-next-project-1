"use client"

import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { Job } from "./data"

interface TimelineChartProps {
  data: Job[]
}

export default function TimelineChart({ data }: TimelineChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const jobsByDate: Record<string, number> = {}

    // Group jobs by date (YYYY-MM-DD)
    data.forEach((job) => {
      const date = new Date(job.createdAt)
      const dateStr = date.toISOString().split("T")[0]

      jobsByDate[dateStr] = (jobsByDate[dateStr] || 0) + 1
    })

    // Convert to array and sort by date
    const sortedData = Object.entries(jobsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate cumulative count
    let cumulative = 0
    return sortedData.map(({ date, count }) => {
      cumulative += count
      return {
        date,
        newJobs: count,
        totalJobs: cumulative,
      }
    })
  }, [data])

  return (
    <ChartContainer
      config={{
        date: {
          label: "Date",
        },
        newJobs: {
          label: "New Jobs",
          color: "hsl(var(--chart-1))",
        },
        totalJobs: {
          label: "Total Jobs",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 24 }}>
          <defs>
            <linearGradient id="colorNewJobs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTotalJobs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="newJobs"
            stroke="hsl(var(--chart-1))"
            fillOpacity={1}
            fill="url(#colorNewJobs)"
          />
          <Area
            type="monotone"
            dataKey="totalJobs"
            stroke="hsl(var(--chart-3))"
            fillOpacity={1}
            fill="url(#colorTotalJobs)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}