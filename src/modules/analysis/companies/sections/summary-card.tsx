"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface SummaryCardProps {
  totalJobs: number
  genderFilter: string[]
  isRemoteFilter: boolean | null
  isDisabilityAllowedFilter: boolean | null
  onGenderFilterChange: (value: string) => void
  onRemoteFilterChange: (value: boolean | null) => void
  onDisabilityFilterChange: (value: boolean | null) => void
}

export default function SummaryCard({
  totalJobs,
  genderFilter,
  isRemoteFilter,
  isDisabilityAllowedFilter,
  onGenderFilterChange,
  onRemoteFilterChange,
  onDisabilityFilterChange,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Job Analytics Dashboard</CardTitle>
        <CardDescription>Interactive visualization of available job opportunities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-3xl font-bold">{totalJobs} Jobs Available</div>
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Gender</h4>
              <div className="flex flex-col gap-2">
                {["Male", "Female", "Other"].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gender-${gender.toLowerCase()}`}
                      checked={genderFilter.includes(gender)}
                      onCheckedChange={() => onGenderFilterChange(gender)}
                    />
                    <Label htmlFor={`gender-${gender.toLowerCase()}`}>{gender}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Remote Work</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote-yes"
                    checked={isRemoteFilter === true}
                    onCheckedChange={() => onRemoteFilterChange(isRemoteFilter === true ? null : true)}
                  />
                  <Label htmlFor="remote-yes">Remote</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote-no"
                    checked={isRemoteFilter === false}
                    onCheckedChange={() => onRemoteFilterChange(isRemoteFilter === false ? null : false)}
                  />
                  <Label htmlFor="remote-no">On-site</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Disability Accommodation</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disability-yes"
                    checked={isDisabilityAllowedFilter === true}
                    onCheckedChange={() => onDisabilityFilterChange(isDisabilityAllowedFilter === true ? null : true)}
                  />
                  <Label htmlFor="disability-yes">Allowed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disability-no"
                    checked={isDisabilityAllowedFilter === false}
                    onCheckedChange={() => onDisabilityFilterChange(isDisabilityAllowedFilter === false ? null : false)}
                  />
                  <Label htmlFor="disability-no">Not Allowed</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}