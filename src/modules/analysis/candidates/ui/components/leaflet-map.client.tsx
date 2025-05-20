// components/leaflet-map.client.tsx
"use client"

import dynamic from "next/dynamic"

export const LeafletMap = dynamic(() => import("./leaflet-chart"), {
  ssr: false,
})
