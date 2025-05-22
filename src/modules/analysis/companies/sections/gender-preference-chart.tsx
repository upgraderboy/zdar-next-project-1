"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Job } from "./data"

interface GenderPreferenceChartProps {
  data: Job[]
  selectedValue: string | null
  onChartClick: (value: string) => void
}

export default function GenderPreferenceChart({ data, selectedValue, onChartClick }: GenderPreferenceChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const genderCounts: Record<string, number> = {
      All: 0,
      Male: 0,
      Female: 0,
      Other: 0,
    }

    data.forEach((job) => {
      if (job.genderPreference) {
        genderCounts[job.genderPreference] = (genderCounts[job.genderPreference] || 0) + 1
      } else {
        genderCounts["All"] += 1
      }
    })

    return Object.entries(genderCounts)
      .filter(([_, count]) => {
        console.log(_, count);
        return count > 0;
      }) // Only include non-zero counts
      .map(([gender, count]) => ({
        name: gender,
        value: count,
      }))
  }, [data])

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <ChartContainer
      config={{
        gender: {
          label: "Gender Preference",
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
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            onClick={(_, index) => {
              if (chartData[index]) {
                onChartClick(chartData[index].name)
              }
            }}
            cursor="pointer"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={true}
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
            content={<ChartTooltipContent labelKey="gender" formatter={(value) => `${value} jobs`} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}