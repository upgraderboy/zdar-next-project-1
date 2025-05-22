// "use client"

// import { useMemo, useRef, useEffect } from "react"
// import { ChartContainer } from "@/components/ui/chart"
// import { Job } from "@/types"
// import * as d3 from "d3"
// import cloud from "d3-cloud"

// interface SkillsWordCloudProps {
//   data: Job[]
//   selectedValue: string | null
//   onChartClick: (value: string) => void
// }

// interface WordData {
//   text: string
//   value: number
//   type: "hard" | "soft"
// }

// export default function SkillsWordCloud({ data, selectedValue, onChartClick }: SkillsWordCloudProps) {
//   const svgRef = useRef<SVGSVGElement>(null)

//   // Process data for the chart
//   const wordData = useMemo(() => {
//     const skillCounts: Record<string, { count: number; type: "hard" | "soft" }> = {}

//     data.forEach((job) => {
//       // Count hard skills
//       job.hardSkills?.forEach((skill) => {
//         if (!skillCounts[skill]) {
//           skillCounts[skill] = { count: 0, type: "hard" }
//         }
//         skillCounts[skill].count += 1
//       })

//       // Count soft skills
//       job.softSkills?.forEach((skill) => {
//         if (!skillCounts[skill]) {
//           skillCounts[skill] = { count: 0, type: "soft" }
//         }
//         skillCounts[skill].count += 1
//       })
//     })

//     // Sort by count and take top 50
//     return Object.entries(skillCounts)
//       .sort((a, b) => b[1].count - a[1].count)
//       .slice(0, 50)
//       .map(([skill, { count, type }]) => ({
//         text: skill,
//         value: count,
//         type,
//       }))
//   }, [data])

//   useEffect(() => {
//     if (!svgRef.current || wordData.length === 0) return

//     const svg = d3.select(svgRef.current)
//     svg.selectAll("*").remove()

//     const width = svgRef.current.clientWidth
//     const height = svgRef.current.clientHeight

//     const layout = cloud()
//       .size([width, height])
//       .words(wordData)
//       .padding(5)
//       .rotate(0)
//       .on("end", draw)

//     layout.start()

//     function draw(words: string[]) {
//       const group = svg
//         .append("g")
//         .attr("transform", `translate(${width / 2},${height / 2})`)
//         .selectAll("text")
//         .data(words)
//         .enter()
//         .append("text")
//         .style("font-size", (d) => `${d.size}px`)
//         .style("font-family", "Impact")
//         .style("fill", (d: WordData) => {
//           if (d.text === selectedValue) {
//             return d.type === "hard" ? "hsl(var(--chart-1))" : "hsl(var(--chart-4))"
//           }
//           return d.type === "hard" ? "hsl(var(--chart-1))99" : "hsl(var(--chart-4))99"
//         })
//         .style("cursor", "pointer")
//         .style("font-weight", (d) => (d.text === selectedValue ? "bold" : "normal"))
//         .attr("text-anchor", "middle")
//         .attr("transform", (d) => `translate(${d.x},${d.y})`)
//         .text((d) => d.text)
//         .on("click", (event, d: WordData) => {
//           onChartClick(d.text)
//         })
//     }
//   }, [wordData, selectedValue, onChartClick])

//   return (
//     <ChartContainer
//       config={{
//         skill: {
//           label: "Skill",
//         },
//         count: {
//           label: "Count",
//         },
//       }}
//       className="h-[300px]"
//     >
//       <div className="w-full h-full relative">
//         <svg ref={svgRef} width="100%" height="100%"></svg>
//         <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-2">
//           <div className="flex items-center">
//             <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
//             <span className="text-xs">Hard Skills</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: "hsl(var(--chart-4))" }} />
//             <span className="text-xs">Soft Skills</span>
//           </div>
//         </div>
//       </div>
//     </ChartContainer>
//   )
// }