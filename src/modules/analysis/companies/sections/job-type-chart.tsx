"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Job } from "@/types"


interface JobTypeChartProps {
  data: Job[]
  selectedValue: string | null
  onChartClick: (value: string) => void
}

export default function JobTypeChart({ data, selectedValue, onChartClick }: JobTypeChartProps) {
  // Process data for the chart
  const chartData = useMemo(() => {
    const jobTypeCounts: Record<string, number> = {
      "Full-Time": 0,
      "Part-Time": 0,
      Internship: 0,
      Other: 0,
    }

    data.forEach((job) => {
      if (job.jobType) {
        if (["Full-Time", "Part-Time", "Internship"].includes(job.jobType)) {
          jobTypeCounts[job.jobType] += 1
        } else {
          jobTypeCounts["Other"] += 1
        }
      }
    })

    // Remove categories with zero count
    return Object.entries(jobTypeCounts)
      .filter(([_, count]) => {
        console.log(_, count)
        return count > 0;
      })
      .map(([jobType, count]) => ({
        name: jobType,
        value: count,
      }))
  }, [data])

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

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
        jobType: {
          label: "Job Type",
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
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onClick={(_, index) => {
              if (chartData[index]) {
                onChartClick(chartData[index].name)
              }
            }}
            cursor="pointer"
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
          <Tooltip formatter={(value) => [`${value} jobs`, "Count"]} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
