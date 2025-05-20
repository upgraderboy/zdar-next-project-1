"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface SkillsWordCloudProps {
  title: string
  skills: string[]
  onSkillSelect: (skill: string) => void
  activeSkill: string | null
}

interface SkillCount {
  text: string
  value: number
}

export function SkillsWordCloud({ title, skills, onSkillSelect, activeSkill }: SkillsWordCloudProps) {
  const [skillCounts, setSkillCounts] = useState<SkillCount[]>([])

  useEffect(() => {
    // Count occurrences of each skill
    const counts = skills.reduce(
      (acc, skill) => {
        if (!acc[skill]) {
          acc[skill] = 0
        }
        acc[skill]++
        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to array and sort by count
    const skillCountArray = Object.entries(counts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 30) // Limit to top 30 skills

    setSkillCounts(skillCountArray)
  }, [skills])

  // Calculate font size based on count
  const getSize = (count: number) => {
    const max = Math.max(...skillCounts.map((s) => s.value))
    const min = Math.min(...skillCounts.map((s) => s.value))
    const range = max - min || 1
    const normalized = (count - min) / range
    return 14 + normalized * 24 // Font size between 14px and 38px
  }

  // Get a color based on count
  const getColor = (count: number, isActive: boolean) => {
    if (isActive) return "#000000"

    const max = Math.max(...skillCounts.map((s) => s.value))
    const min = Math.min(...skillCounts.map((s) => s.value))
    const range = max - min || 1
    const normalized = (count - min) / range

    // Color gradient from light blue to dark blue
    const r = Math.floor(0 + normalized * 0)
    const g = Math.floor(136 + normalized * (0 - 136))
    const b = Math.floor(254 + normalized * (139 - 254))

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] overflow-hidden">
        <div className="flex flex-wrap justify-center items-center gap-2 h-full">
          {skillCounts.map((skill, index) => (
            <div
              key={index}
              className="cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{
                fontSize: `${getSize(skill.value)}px`,
                color: getColor(skill.value, skill.text === activeSkill),
                fontWeight: skill.text === activeSkill ? "bold" : "normal",
                textDecoration: skill.text === activeSkill ? "underline" : "none",
                padding: "4px",
              }}
              onClick={() => onSkillSelect(skill.text)}
            >
              {skill.text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
