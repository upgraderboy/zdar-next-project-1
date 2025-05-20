"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DisabilityFilterProps {
  onFilterChange: (disability: string) => void
  activeFilter: string | null
  resumeCount: {
    YES: number
    NO: number
  }
}

export function DisabilityFilter({ onFilterChange, activeFilter, resumeCount }: DisabilityFilterProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Disability Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant={activeFilter === "YES" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("YES")}
            className="flex-1"
          >
            Yes ({resumeCount.YES})
          </Button>
          <Button
            variant={activeFilter === "NO" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("NO")}
            className="flex-1"
          >
            No ({resumeCount.NO})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
