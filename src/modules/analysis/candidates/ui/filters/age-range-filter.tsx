"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { CandidateAnalysisOutput } from "@/types"

interface AgeRangeFilterProps {
  data: CandidateAnalysisOutput
  onAgeRangeChange: (min: number, max: number) => void
  activeRange: [number, number] | null
}

export function AgeRangeFilter({
  data,
  onAgeRangeChange,
  activeRange,
}: AgeRangeFilterProps) {
  const minDataAge = data.reduce(
    (min, resume) =>
      resume.age !== null && resume.age < min ? resume.age : min,
    Infinity
  )
  const maxDataAge = data.reduce(
    (max, resume) =>
      resume.age !== null && resume.age > max ? resume.age : max,
    -Infinity
  )

  // Handle edge case where no valid age data is present
  const isValidRange =
    Number.isFinite(minDataAge) &&
    Number.isFinite(maxDataAge) &&
    minDataAge <= maxDataAge

  const [range, setRange] = useState<[number, number]>(
    activeRange && isValidRange ? activeRange : [minDataAge, maxDataAge]
  )

  useEffect(() => {
    if (activeRange) {
      setRange(activeRange)
    } else if (isValidRange && data.length > 0) {
      setRange([minDataAge, maxDataAge])
    }
  }, [activeRange, data, minDataAge, maxDataAge, isValidRange])

  if (!isValidRange) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Age Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No valid age data available.
          </div>
        </CardContent>
      </Card>
    )
  }

  const ageDistribution = Array.from(
    { length: maxDataAge - minDataAge + 1 },
    (_, i) => {
      const age = minDataAge + i
      return {
        age,
        count: data.filter((r) => r.age === age).length,
      }
    }
  )

  const handleSliderChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]]
    setRange(newRange)
    onAgeRangeChange(newRange[0], newRange[1])
  }

  const resumesInRange = data.filter(
    (r) => r.age !== null && r.age >= range[0] && r.age <= range[1]
  ).length

  const xAxisTicks = Array.from(
    new Set([
      minDataAge,
      Math.floor((minDataAge + maxDataAge) / 2),
      maxDataAge,
    ])
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Age Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={ageDistribution} barCategoryGap={1}>
                <XAxis
                  dataKey="age"
                  tick={{ fontSize: 10 }}
                  ticks={xAxisTicks}
                />
                <YAxis hide />
                <Bar dataKey="count" fill="#8884d8">
                  {ageDistribution.map((entry) => (
                    <Cell
                      key={`bar-${entry.age}`} // <-- unique key per age
                      fill={
                        entry.age >= range[0] && entry.age <= range[1]
                          ? "#0088FE"
                          : "#E0E0E0"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="px-2">
            <Slider
              defaultValue={[minDataAge, maxDataAge]}
              value={[range[0], range[1]]}
              min={minDataAge}
              max={maxDataAge}
              step={1}
              onValueChange={handleSliderChange}
              className="mt-6"
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <div>{range[0]} years</div>
            <div>{range[1]} years</div>
          </div>

          <div className="text-center">
            <span className="text-lg font-bold">{resumesInRange}</span>
            <span className="text-sm text-muted-foreground">
              {" "}
              candidates in selected range
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
