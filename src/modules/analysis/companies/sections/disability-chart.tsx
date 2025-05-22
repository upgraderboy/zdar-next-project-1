"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Job } from "./data"

interface DisabilityChartProps {
  data: Job[]
  selectedValue: string | null
  onChartClick: (value: string) => void
}

export default function DisabilityChart({ data, selectedValue, onChartClick }: DisabilityChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    let disabilityAllowed = 0
    let disabilityNotAllowed = 0

    data.forEach((job) => {
      if (job.isDisabilityAllowed) {
        disabilityAllowed += 1
      } else {
        disabilityNotAllowed += 1
      }
    })

    return [
      { name: "Disability Allowed", value: disabilityAllowed },
      { name: "Disability Not Allowed", value: disabilityNotAllowed },
    ]
  }, [data])

  const COLORS = ["hsl(var(--chart-3))", "hsl(var(--chart-5))"]

  return (
    <ChartContainer
      config={{
        disability: {
          label: "Disability Status",
        },
        count: {
          label: "Count",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            onClick={(_, index) => {
              if (chartData[index]) {
                onChartClick(chartData[index].name)
              }
            }}
            cursor="pointer"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
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
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            onClick={(data) => onChartClick(data.value)}
          />
          <ChartTooltip
            content={<ChartTooltipContent labelKey="disability" labelFormatter={(value) => `${value} jobs`} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
