"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CandidateAnalysisOutput } from "@/types"

interface WorldMapProps {
  data: CandidateAnalysisOutput
  onLocationSelect: (location: string) => void
  activeLocation: string | null
}

interface CountryCount {
  country: string
  count: number
  coordinates: [number, number]
}

export function WorldMap({ data, onLocationSelect, activeLocation }: WorldMapProps) {
  const [countryData, setCountryData] = useState<CountryCount[]>([])
  const [mapDimensions, setMapDimensions] = useState({ width: 800, height: 450 })

  useEffect(() => {
    // Count resumes by country
    const countries = data.reduce(
      (acc, resume) => {
        if (!resume.country) return acc;
        const country = resume.country
        if (!acc[country]) {
          acc[country] = 0
        }
        acc[country]++
        return acc
      },
      {} as Record<string, number>,
    )

    // Map country names to coordinates (simplified for demo)
    const countryCoordinates: Record<string, [number, number]> = {
      USA: [39.8283, -98.5795],
      Canada: [56.1304, -106.3468],
      UK: [55.3781, -3.436],
      Germany: [51.1657, 10.4515],
      France: [46.2276, 2.2137],
      India: [20.5937, 78.9629],
      Australia: [-25.2744, 133.7751],
      Japan: [36.2048, 138.2529],
      Brazil: [-14.235, -51.9253],
      China: [35.8617, 104.1954],
      // Add more countries as needed
    }

    const countryDataArray = Object.entries(countries).map(([country, count]) => ({
      country,
      count,
      coordinates: countryCoordinates[country] || [0, 0],
    }))

    setCountryData(countryDataArray)

    // Responsive map dimensions
    const handleResize = () => {
      const width = Math.min(window.innerWidth - 40, 800)
      const height = width * 0.5625 // 16:9 aspect ratio
      setMapDimensions({ width, height })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [data])

  // Simple map projection (Mercator-like)
  const projectCoordinates = (lat: number, lng: number): [number, number] => {
    const x = (lng + 180) * (mapDimensions.width / 360)
    const y = (90 - lat) * (mapDimensions.height / 180)
    return [x, y]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] relative">
        <div className="w-full h-full bg-gray-100 rounded-md overflow-hidden">
          {/* Simplified world map background */}
          <svg
            width={mapDimensions.width}
            height={mapDimensions.height}
            viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
            className="bg-sky-50"
          >
            {/* Simplified continents */}
            <path d="M150,100 Q200,50 250,100 T350,100 T450,100 T550,100 T650,100" fill="#e5e7eb" stroke="#d1d5db" />
            <path d="M100,200 Q200,150 300,200 T500,200 T700,200" fill="#e5e7eb" stroke="#d1d5db" />
            <path d="M200,300 Q300,250 400,300 T600,300" fill="#e5e7eb" stroke="#d1d5db" />

            {/* Country pins */}
            {countryData.map((country, index) => {
              const [x, y] = projectCoordinates(country.coordinates[0], country.coordinates[1])
              const isActive = country.country === activeLocation
              const radius = Math.max(4, Math.min(country.count * 2, 12))

              return (
                <g key={index} onClick={() => onLocationSelect(country.country)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={isActive ? "#0088FE" : "#FF8042"}
                    stroke={isActive ? "#000" : "none"}
                    strokeWidth={isActive ? 2 : 0}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  <title>{`${country.country}: ${country.count} resumes`}</title>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {countryData.map((country, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onLocationSelect(country.country)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: country.country === activeLocation ? "#0088FE" : "#FF8042",
                  outline: country.country === activeLocation ? "2px solid black" : "none",
                  outlineOffset: "2px",
                }}
              />
              <span className={country.country === activeLocation ? "font-bold" : ""}>
                {country.country} ({country.count})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
