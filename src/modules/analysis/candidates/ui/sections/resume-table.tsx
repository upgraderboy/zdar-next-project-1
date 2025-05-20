"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import type { Resume } from "@/types"

interface ResumeTableProps {
  data: Resume[]
}

export function ResumeTable({ data }: ResumeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Resume>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Title</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">First Name</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Last Name</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
    },
    {
      accessorKey: "age",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Age</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("age")}</div>,
    },
    {
      accessorKey: "jobTitle",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Job Title</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("jobTitle")}</div>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Category</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "contractType",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Contract Type</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("contractType")}</div>,
    },
    {
      accessorKey: "country",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Country</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("country")}</div>,
    },
    {
      accessorKey: "disability",
      header: ({ column }) => {
        return (
          <div>
            <div className="font-medium">Disability</div>
            <Input
              placeholder="Filter..."
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="mt-1 h-8 w-full"
            />
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("disability")}</div>,
    },
  ]

  const table = useReactTable<Resume>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  const exportToCSV = () => {
    // Get the current filtered data
    const filteredData = table.getFilteredRowModel().rows.map((row) => row.original)

    // Convert to CSV
    const headers = columns.map((column) => column.header).join(",")
    const rows = filteredData.map((row) => {
      return columns
        .map((column) => {
          const key = column.id as keyof Resume
          const value = row[key]
          return typeof value === "string" ? `"${value}"` : value
        })
        .join(",")
    })

    const csv = [headers, ...rows].join("\n")

    // Create a download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "resume_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resume Data</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {table.getFilteredRowModel().rows.length} of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
