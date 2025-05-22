"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DownloadIcon, FilterIcon, RefreshCwIcon, SearchIcon } from "lucide-react"
import SummaryCard from "../sections/summary-card"
import { trpc } from "@/trpc/client"
import JobTypeChart from "../sections/job-type-chart"
import ExperienceLevelChart from "../sections/experience-level-chart"
import AgeCategoryChart from "../sections/age-category-chart"
// import SkillsWordCloud from "../sections/skills-word-cloud"
import SalaryRangeChart from "../sections/salary-range-chart"
import LocationMap from "../sections/location-map"
import JobsTable from "../sections/jobs-table"
import { AgeCategory } from "@/types"

export default function JobAnalyticsDashboard() {
  const { data: companiesWithJobs } = trpc.analysis.companyAnalysis.useQuery();

const allJobs = companiesWithJobs?.flatMap((company) => company.jobs);

  // State for filters
  const [filters, setFilters] = useState<{
    jobType: string | null
    experienceLevel: string | null
    salaryRange: string | null
    location: string | null
    skill: string | null
    ageCategory: AgeCategory | null
    companyId: string | null
  }>({
    jobType: null,
    experienceLevel: null,
    salaryRange: null,
    location: null,
    skill: null,
    ageCategory: null,
    companyId: null,
  })

  // State for checkbox filters
  const [genderFilter, setGenderFilter] = useState<string[]>([])
  const [isRemoteFilter, setIsRemoteFilter] = useState<boolean | null>(null)
  const [isDisabilityAllowedFilter, setIsDisabilityAllowedFilter] = useState<boolean | null>(null)

  // State for search
  const [searchQuery, setSearchQuery] = useState("")

  // Filter jobs based on selected filters and search query
  const filteredJobs = useMemo(() => {
    return allJobs?.filter((job) => {
      // Apply chart filters
      if (filters.jobType && job.jobType !== filters.jobType) return false
      if (filters.experienceLevel) {
        // Map experience levels to our categories
        const experienceMapping: Record<string, string> = {
          Junior: "Fresher",
          "Mid-Level": "Intermediate",
          Senior: "Senior",
          Lead: "Senior",
          Executive: "Senior",
        }
        const mappedLevel = experienceMapping[job.experienceLevel] || "Intermediate"
        if (mappedLevel !== filters.experienceLevel) return false
      }
      if (filters.salaryRange && job.salaryRange !== filters.salaryRange) return false
      if (filters.location && `${job.stateName}, ${job.countryName}` !== filters.location) return false
      if (filters.companyId && job.companyId !== filters.companyId) return false

      // Filter by skill
      if (filters.skill) {
        const hasSkill = job.hardSkills?.includes(filters.skill) || job.softSkills?.includes(filters.skill)
        if (!hasSkill) return false
      }

      // Filter by age category
      if (filters.ageCategory && !job.ageCategory?.includes(filters.ageCategory)) return false

      // Filter by gender preference
      if (genderFilter.length > 0 && !genderFilter.includes(job.genderPreference || "All")) return false

      // Filter by remote status
      if (isRemoteFilter !== null && job.isRemote !== isRemoteFilter) return false

      // Filter by disability status
      if (isDisabilityAllowedFilter !== null && job.isDisabilityAllowed !== isDisabilityAllowedFilter) return false

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          job.title.toLowerCase().includes(query) ||
          job.companyName?.toLowerCase().includes(query) ||
          job.jobType.toLowerCase().includes(query) ||
          job.experienceLevel.toLowerCase().includes(query) ||
          job.salaryRange?.toLowerCase().includes(query) ||
          job.stateName?.toLowerCase().includes(query) ||
          job.countryName?.toLowerCase().includes(query) ||
          job.hardSkills?.some((skill) => skill.toLowerCase().includes(query)) ||
          job.softSkills?.some((skill) => skill.toLowerCase().includes(query))
        )
      }

      return true
    })
  }, [allJobs, filters, genderFilter, isRemoteFilter, isDisabilityAllowedFilter, searchQuery])

  // Handle chart click
  const handleChartClick = useCallback((category: keyof typeof filters, value: string) => {
    if (!value) return

    setFilters((prev) => {
      // If the same value is clicked again, deselect it
      if (prev[category] === value) {
        return { ...prev, [category]: null }
      }
      // Otherwise, select the new value
      return { ...prev, [category]: value }
    })
  }, [])

  // Handle gender filter change
  const handleGenderFilterChange = useCallback((gender: string) => {
    setGenderFilter((prev) => {
      if (prev.includes(gender)) {
        return prev.filter((g) => g !== gender)
      } else {
        return [...prev, gender]
      }
    })
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      jobType: null,
      experienceLevel: null,
      salaryRange: null,
      location: null,
      skill: null,
      ageCategory: null,
      companyId: null,
    })
    setGenderFilter([])
    setIsRemoteFilter(null)
    setIsDisabilityAllowedFilter(null)
    setSearchQuery("")
  }, [])

  // Export data as CSV
  const exportToCSV = useCallback(() => {
    const headers = [
      "Title",
      "Company",
      "Job Type",
      "Experience Level",
      "Salary Range",
      "Location",
      "Hard Skills",
      "Soft Skills",
      "Age Category",
      "Gender Preference",
      "Remote",
      "Disability Allowed",
    ]

    const csvData = filteredJobs?.map((job) => [
      job.title,
      job.companyName,
      job.jobType,
      job.experienceLevel,
      job.salaryRange || "Not specified",
      `${job.stateName || ""}, ${job.countryName || ""}`,
      job.hardSkills?.join(", ") || "",
      job.softSkills?.join(", ") || "",
      job.ageCategory?.join(", ") || "",
      job.genderPreference || "All",
      job.isRemote ? "Yes" : "No",
      job.isDisabilityAllowed ? "Yes" : "No",
    ])
    const csvContent = [
      headers.join(","),
      ...((csvData ?? []).map((row) => row.map((cell) => `"${cell}"`).join(","))),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "job_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [filteredJobs])

  // Get company options for filtering
  const companyOptions = useMemo(() => {
    return companiesWithJobs?.map((company) => ({
      id: company.id,
      name: company.name,
      jobCount: company.jobs.length,
    }))
  }, [companiesWithJobs])

  return (
    <div className="w-full container mx-auto space-y-6">
      {/* Summary Card with Filters */}
      <SummaryCard
        totalJobs={allJobs?.length || 0}
        genderFilter={genderFilter}
        isRemoteFilter={isRemoteFilter}
        isDisabilityAllowedFilter={isDisabilityAllowedFilter}
        onGenderFilterChange={handleGenderFilterChange}
        onRemoteFilterChange={setIsRemoteFilter}
        onDisabilityFilterChange={setIsDisabilityAllowedFilter}
      />

      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={
              !Object.values(filters).some(Boolean) &&
              !genderFilter.length &&
              isRemoteFilter === null &&
              isDisabilityAllowedFilter === null &&
              !searchQuery
            }
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV} disabled={filteredJobs?.length === 0}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      {(Object.values(filters).some(Boolean) ||
        genderFilter.length > 0 ||
        isRemoteFilter !== null ||
        isDisabilityAllowedFilter !== null) && (
        <div className="flex flex-wrap gap-2 items-center">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.jobType && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleChartClick("jobType", filters.jobType || "")}
            >
              Job Type: {filters.jobType} ×
            </Button>
          )}
          {filters.experienceLevel && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleChartClick("experienceLevel", filters.experienceLevel || "")}
            >
              Experience: {filters.experienceLevel} ×
            </Button>
          )}
          {filters.salaryRange && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleChartClick("salaryRange", filters.salaryRange || "")}
            >
              Salary: {filters.salaryRange} ×
            </Button>
          )}
          {filters.location && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleChartClick("location", filters.location || "")}
            >
              Location: {filters.location} ×
            </Button>
          )}
          {filters.skill && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleChartClick("skill", filters.skill || "")}
            >
              Skill: {filters.skill} ×
            </Button>
          )}
          {filters.ageCategory && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleChartClick("ageCategory", filters.ageCategory || "")}
            >
              Age: {filters.ageCategory} ×
            </Button>
          )}
          {filters.companyId && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleChartClick("companyId", filters.companyId || "")}
            >
              Company: {companiesWithJobs?.find((c) => c.id === filters.companyId)?.name || "Unknown"} ×
            </Button>
          )}
          {genderFilter.map((gender) => (
            <Button
              key={gender}
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleGenderFilterChange(gender)}
            >
              Gender: {gender} ×
            </Button>
          ))}
          {isRemoteFilter !== null && (
            <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => setIsRemoteFilter(null)}>
              {isRemoteFilter ? "Remote" : "On-site"} ×
            </Button>
          )}
          {isDisabilityAllowedFilter !== null && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setIsDisabilityAllowedFilter(null)}
            >
              Disability: {isDisabilityAllowedFilter ? "Allowed" : "Not Allowed"} ×
            </Button>
          )}
        </div>
      )}

      {/* Primary Charts - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Job Types</CardTitle>
            <CardDescription>Distribution by job type</CardDescription>
          </CardHeader>
          <CardContent>
            {allJobs && (
            <JobTypeChart
              data={allJobs}
              selectedValue={filters.jobType}
              onChartClick={(value) => handleChartClick("jobType", value)}
            />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Experience Levels</CardTitle>
            <CardDescription>Jobs by required experience</CardDescription>
          </CardHeader>
          <CardContent>
            {allJobs && (
            <ExperienceLevelChart
              data={allJobs}
              selectedValue={filters.experienceLevel}
              onChartClick={(value) => handleChartClick("experienceLevel", value)}
            />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Age Categories</CardTitle>
            <CardDescription>Jobs by preferred age range</CardDescription>
          </CardHeader>
          <CardContent>
            {allJobs && (
            <AgeCategoryChart
              data={allJobs}
              selectedValue={filters.ageCategory}
              onChartClick={(value) => handleChartClick("ageCategory", value)}
            />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Skills Distribution</CardTitle>
            <CardDescription>Most in-demand skills (click to filter)</CardDescription>
          </CardHeader>
          <CardContent>
            {allJobs && (
            <SkillsWordCloud
              data={allJobs}
              selectedValue={filters.skill}
              onChartClick={(value) => handleChartClick("skill", value)}
            />
            )}
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Salary Ranges</CardTitle>
            <CardDescription>Jobs by salary bracket</CardDescription>
          </CardHeader>
          <CardContent>
            {allJobs && (
            <SalaryRangeChart
              data={allJobs}
              selectedValue={filters.salaryRange}
              onChartClick={(value) => handleChartClick("salaryRange", value)}
            />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Geographic Distribution</CardTitle>
          <CardDescription>Click on locations to filter jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {allJobs && (
          <LocationMap
            data={allJobs}
            selectedLocation={filters.location}
            onLocationClick={(value) => handleChartClick("location", value)}
          />
          )}
        </CardContent>
      </Card>

      {/* Companies Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Companies</CardTitle>
          <CardDescription>Jobs by company</CardDescription>
        </CardHeader>
        <CardContent>
          {companyOptions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {companyOptions?.map((company) => (
              <div
                key={company.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  filters.companyId === company.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                onClick={() => handleChartClick("companyId", company.id)}
              >
                <div className="font-medium">{company.name}</div>
                <div className="text-sm">{company.jobCount} jobs</div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Available Jobs</span>
            <span className="text-sm font-normal text-muted-foreground">
              Showing {filteredJobs?.length} of {allJobs?.length} jobs
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allJobs && (
          <JobsTable data={filteredJobs || []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}