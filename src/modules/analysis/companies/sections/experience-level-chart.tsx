"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Job } from "@/types"

interface ExperienceLevelChartProps {
  data: Job[]
  selectedValue: string | null
  onChartClick: (value: string) => void
}

export default function ExperienceLevelChart({ data, selectedValue, onChartClick }: ExperienceLevelChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const experienceCounts: Record<string, number> = {}

    data.forEach((job) => {
      if (job.experienceLevel) {
        experienceCounts[job.experienceLevel] = (experienceCounts[job.experienceLevel] || 0) + 1
      }
    })

    return Object.entries(experienceCounts).map(([level, count]) => ({
      name: level,
      value: count,
    }))
  }, [data])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show labels for small segments

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ChartContainer
      config={{
        experience: {
          label: "Experience Level",
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
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            onClick={(_, index) => {
              if (chartData[index]) {
                onChartClick(chartData[index].name)
              }
            }}
            cursor="pointer"
            labelLine={false}
            label={renderCustomizedLabel}
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
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
            onClick={(data) => onChartClick(data.value)}
          />
          <ChartTooltip
            content={<ChartTooltipContent labelKey="experience" labelFormatter={(value) => `${value} jobs`} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
