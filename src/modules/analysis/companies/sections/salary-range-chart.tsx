"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Job } from "@/types"

interface SalaryRangeChartProps {
  data: Job[]
  selectedValue: string | null
  onChartClick: (value: string) => void
}

export default function SalaryRangeChart({ data, selectedValue, onChartClick }: SalaryRangeChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const salaryCounts: Record<string, number> = {
      "Not Specified": 0,
    }

    data.forEach((job) => {
      if (job.salaryRange) {
        salaryCounts[job.salaryRange] = (salaryCounts[job.salaryRange] || 0) + 1
      } else {
        salaryCounts["Not Specified"] += 1
      }
    })

    return Object.entries(salaryCounts).map(([range, count]) => ({
      name: range,
      value: count,
      fill: range === selectedValue ? "hsl(var(--chart-3))" : "hsl(var(--chart-5))",
    }))
  }, [data, selectedValue])

  // Sort data by value for better visualization
  const sortedData = useMemo(() => {
    return [...chartData].sort((a, b) => b.value - a.value)
  }, [chartData])

  return (
    <ChartContainer
      config={{
        salary: {
          label: "Salary Range",
        },
        count: {
          label: "Count",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 100, bottom: 10 }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              onChartClick(data.activePayload[0].payload.name)
            }
          }}
        >
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={90}
            tickFormatter={(value) => {
              // Truncate long labels
              return value.length > 12 ? value.substring(0, 10) + "..." : value
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer" fill="var(--color-count)" />
          <ChartTooltip
            content={<ChartTooltipContent labelKey="salary" formatter={(value) => `${value} jobs`} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}