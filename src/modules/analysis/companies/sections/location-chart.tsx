"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Job } from "./data";

interface LocationChartProps {
  data: Job[]
  selectedValue: string | null
  onChartClick: (value: string) => void
}

export default function LocationChart({ data, selectedValue, onChartClick }: LocationChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const locationCounts: Record<string, number> = {}

    data.forEach((job) => {
      if (job.stateName && job.countryName) {
        const location = `${job.stateName}, ${job.countryName}`
        locationCounts[location] = (locationCounts[location] || 0) + 1
      }
    })

    // Sort by count and take top 10
    return Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({
        name: location,
        value: count,
      }))
  }, [data])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6, 210 100% 50%))",
    "hsl(var(--chart-7, 270 100% 50%))",
    "hsl(var(--chart-8, 300 100% 50%))",
    "hsl(var(--chart-9, 330 100% 50%))",
    "hsl(var(--chart-10, 30 100% 50%))",
  ]

  return (
    <ChartContainer
      config={{
        location: {
          label: "Location",
        },
        count: {
          label: "Count",
        },
      }}
      className="h-[300px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              onClick={(_, index) => {
                if (chartData[index]) {
                  onChartClick(chartData[index].name)
                }
              }}
              cursor="pointer"
              label={({ name, percent }) => `${name.split(",")[0]}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === selectedValue ? COLORS[index % COLORS.length] : `${COLORS[index % COLORS.length]}99`
                  }
                  stroke={entry.name === selectedValue ? COLORS[index % COLORS.length] : "none"}
                  strokeWidth={entry.name === selectedValue ? 2 : 0}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent labelKey="location" labelFormatter={(value) => `${value} jobs`} />}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-medium mb-2">Top Locations</h4>
          <div className="space-y-1 overflow-auto max-h-[250px] pr-2">
            {chartData.map((entry, index) => (
              <div
                key={`legend-${index}`}
                className={`flex items-center justify-between p-1.5 rounded-md cursor-pointer text-sm ${
                  entry.name === selectedValue ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => onChartClick(entry.name)}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate max-w-[150px]">{entry.name}</span>
                </div>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartContainer>
  )
}