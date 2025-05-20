"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { CandidateAnalysisOutput } from "@/types"

// Fix for Leaflet marker icons in Next.js
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Custom marker icon for active location
const activeMarkerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 46], // Slightly larger
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "active-marker", // Add a class for styling
})

interface LeafletMapProps {
  data: CandidateAnalysisOutput
  onLocationSelect: (location: string) => void
  activeLocation: string | null
}

// Component to recenter map when data changes
function MapUpdater({ data }: { data: CandidateAnalysisOutput }) {
  const map = useMap()

  useEffect(() => {
    if (data.length > 0) {
      if (data[0].lat === null || data[0].lng === null || data[0].lat === undefined || data[0].lng === undefined) return
      // Create bounds from all markers
      const bounds = L.latLngBounds(data.map((resume) => [resume.lat!, resume.lng!]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [data, map])

  return null;
}

export default function LeafletMap({ data, onLocationSelect, activeLocation }: LeafletMapProps) {
  // Group resumes by location to avoid duplicate markers
  const locationGroups = data.reduce(
    (acc, resume) => {
      const key = `${resume.lat},${resume.lng}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(resume)
      return acc
    },
    {} as Record<string, CandidateAnalysisOutput>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div className="w-full h-full rounded-md overflow-hidden">
          <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {Object.entries(locationGroups).map(([key, resumes], index) => {
              const [lat, lng] = key.split(",").map(Number)
              const isActive = resumes.some((r) => r.city === activeLocation || r.country === activeLocation)

              return (
                <Marker
                  key={index}
                  position={[lat, lng]}
                  icon={isActive ? activeMarkerIcon : markerIcon}
                  eventHandlers={{
                    click: () => {
                      onLocationSelect(resumes[0].city!)
                    },
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">
                        {resumes[0].city}, {resumes[0].country}
                      </h3>
                      <p className="text-sm mb-2">{resumes.length} candidate(s)</p>

                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {resumes.slice(0, 5).map((resume, i) => (
                          <div key={i} className="border-t pt-2 first:border-t-0 first:pt-0">
                            <p className="font-medium">
                              {resume.firstName} {resume.lastName}
                            </p>
                            <p className="text-xs">{resume.jobTitle}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{resume.category}</span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                {resume.jobType}
                              </span>
                            </div>
                          </div>
                        ))}

                        {resumes.length > 5 && (
                          <p className="text-xs text-gray-500 italic">+ {resumes.length - 5} more candidates</p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}

            <MapUpdater data={data} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
