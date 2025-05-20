"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { CandidateAnalysisOutput } from "@/types"

interface CategoryChartProps {
  data: CandidateAnalysisOutput
  onCategorySelect: (category: string) => void
  activeCategory: string | null
}

export function CategoryChart({ data, onCategorySelect, activeCategory }: CategoryChartProps) {
  const categories = data.reduce(
    (acc, resume) => {
      const category = resume.skillType
      if (!category) return acc;
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category]++
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ["#0088FE", "#00C49F"]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={{
          
        }}>
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
                onClick={(data) => onCategorySelect(data.name)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={entry.name === activeCategory ? "#000" : "none"}
                    strokeWidth={entry.name === activeCategory ? 2 : 0}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex justify-center gap-4">
          {chartData.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onCategorySelect(entry.name)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                  outline: entry.name === activeCategory ? "2px solid black" : "none",
                  outlineOffset: "2px",
                }}
              />
              <span className={entry.name === activeCategory ? "font-bold" : ""}>
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
