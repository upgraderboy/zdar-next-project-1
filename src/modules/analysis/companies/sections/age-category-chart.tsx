"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Job } from "@/types"

interface AgeCategoryChartProps {
  data: Job[]
  selectedValue: string | null
  onChartClick: (value: string) => void
}

export default function AgeCategoryChart({ data, selectedValue, onChartClick }: AgeCategoryChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const ageCategoryCounts: Record<string, number> = {}

    data.forEach((job) => {
      job.ageCategory?.forEach((category) => {
        ageCategoryCounts[category] = (ageCategoryCounts[category] || 0) + 1
      })
    })

    return Object.entries(ageCategoryCounts).map(([category, count]) => ({
      name: category,
      value: count,
      fill: category === selectedValue ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))",
    }))
  }, [data, selectedValue])

  return (
    <ChartContainer
      config={{
        ageCategory: {
          label: "Age Category",
        },
        count: {
          label: "Count",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 24 }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              onChartClick(data.activePayload[0].payload.name)
            }
          }}
        >
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={8} interval={0} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer" fill="var(--color-count)" />
          <ChartTooltip
            content={<ChartTooltipContent labelKey="ageCategory" labelFormatter={(value) => `${value} jobs`} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
