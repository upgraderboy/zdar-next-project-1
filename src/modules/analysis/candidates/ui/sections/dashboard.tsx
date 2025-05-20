"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"
import { CategoryChart } from "../components/category-chart"
import { JobTypeChart } from "../components/contract-type-chart"
import { LeafletMap } from "../components/leaflet-map.client"

import { DisabilityFilter } from "../filters/disability-filter"
import { AgeRangeFilter } from "../filters/age-range-filter"
import { ResumeTable } from "./resume-table"

import type { Resume } from "@/types"
import { trpc } from "@/trpc/client"
import { SkillsWordCloud } from "../components/skill-cloud"

export function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([])
  const [filters, setFilters] = useState<{
    category: string | null
    jobType: string | null
    disability: string | null
    location: string | null
    skill: string | null
    ageRange: [number, number] | null
  }>({
    category: null,
    jobType: null,
    disability: null,
    location: null,
    skill: null,
    ageRange: null,
  })

  const [analysisData] = trpc.analysis.candidateAnalysis.useSuspenseQuery();    

  useEffect(() => {
    if (analysisData) {
      setResumes(analysisData)
      setFilteredResumes(analysisData)
    }
  }, [analysisData])

  useEffect(() => {
    // Apply filters
    let result = [...resumes]

    if (filters.category) {
      // fix the types
      result = result.filter((resume) => resume.category === filters.category)
    }

    if (filters.jobType) {
      // fix the types
      result = result.filter((resume) => resume.jobType === filters.jobType)
    }

    if (filters.disability) {
      // fix the types
      result = result.filter((resume) => resume.disability === filters.disability)
    }

    if (filters.location) {
      // fix the types
      result = result.filter((resume) => resume.country === filters.location || resume.city === filters.location)
    }

    if (filters.skill) {
      result = result.filter(
        (resume) =>
          resume.softSkills?.includes(filters.skill as string) || resume.hardSkills?.includes(filters.skill as string),
      )
    }

    if (filters.ageRange) {
      result = result.filter((resume) => resume.age && resume.age >= filters.ageRange![0] && resume.age <= filters.ageRange![1])
    }

    setFilteredResumes(result)
  }, [filters, resumes])

  const handleCategoryFilter = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? null : category,
    }))
  }

  const handleJobTypeFilter = (jobType: string) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType === jobType ? null : jobType,
    }))
  }

  const handleDisabilityFilter = (disability: string) => {
    setFilters((prev) => ({
      ...prev,
      disability: prev.disability === disability ? null : disability,
    }))
  }

  const handleLocationFilter = (location: string) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location === location ? null : location,
    }))
  }

  const handleSkillFilter = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skill: prev.skill === skill ? null : skill,
    }))
  }

  const handleAgeRangeFilter = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      ageRange: [min, max],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      category: null,
      jobType: null,
      disability: null,
      location: null,
      skill: null,
      ageRange: null,
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Resume Analysis Dashboard</h1>
        <Button variant="outline" onClick={clearAllFilters} className="flex items-center gap-2">
          <FilterX className="h-4 w-4" />
          Clear All Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredResumes.length}</div>
          </CardContent>
        </Card>

        <DisabilityFilter
          onFilterChange={handleDisabilityFilter}
          activeFilter={filters.disability}
          resumeCount={{
            YES: resumes.filter((r) => r.disability === "Yes").length,
            NO: resumes.filter((r) => r.disability === "No").length,
          }}
        />

        <AgeRangeFilter data={resumes} onAgeRangeChange={handleAgeRangeFilter} activeRange={filters.ageRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeafletMap data={filteredResumes} onLocationSelect={handleLocationFilter} activeLocation={filters.location} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryChart
            data={filteredResumes}
            onCategorySelect={handleCategoryFilter}
            activeCategory={filters.category}
          />

          <JobTypeChart
            data={filteredResumes}
            onJobTypeSelect={handleJobTypeFilter}
            activeJobType={filters.jobType}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillsWordCloud
          title="Soft Skills"
          skills={filteredResumes.flatMap((r) => r.softSkills!)}
          onSkillSelect={handleSkillFilter}
          activeSkill={filters.skill}
        />

        <SkillsWordCloud
          title="Hard Skills"
          skills={filteredResumes.flatMap((r) => r.hardSkills!)}
          onSkillSelect={handleSkillFilter}
          activeSkill={filters.skill}
        />
      </div>
          <ResumeTable data={filteredResumes} />
    </div>
  )
}