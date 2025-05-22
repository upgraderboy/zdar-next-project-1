"use client"

import { useMemo } from "react"
import { ChartContainer } from "@/components/ui/chart"
import { Job } from "@/types"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

interface LocationMapProps {
  data: Job[]
  selectedLocation: string | null
  onLocationClick: (location: string) => void
}

interface LocationData {
  name: string
  value: number
  fill: string
}

export default function LocationMap({ data, selectedLocation, onLocationClick }: LocationMapProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const locationCounts: Record<string, number> = {}

    data.forEach((job) => {
      if (job.stateName && job.countryName) {
        const location = `${job.stateName}, ${job.countryName}`
        locationCounts[location] = (locationCounts[location] || 0) + 1
      }
    })

    // Sort by count and take top 15
    return Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([location, count]) => ({
        name: location,
        value: count,
        fill: location === selectedLocation ? "hsl(var(--chart-1))" : "hsl(var(--chart-5))",
      }))
  }, [data, selectedLocation])

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
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              const payload = data.activePayload[0].payload as LocationData
              if (payload && typeof payload.name === "string") {
                onLocationClick(payload.name)
              }
            }
          }}
        >
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              // Truncate long location names
              return value.length > 20 ? value.substring(0, 18) + "..." : value
            }}
          />
          <Tooltip
            formatter={(value, name) => [`${value} jobs`, name === "value" ? "Count" : name]}
            labelFormatter={(label) => `Location: ${label}`}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
