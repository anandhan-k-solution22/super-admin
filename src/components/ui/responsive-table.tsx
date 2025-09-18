"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDownUp, MoveDown, MoveUp, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { DualRangeSlider } from "@/components/ui/dual-range-slider"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Column<T extends Record<string, unknown>> {
  key: keyof T & string
  title: string
  render?: (value: unknown, item: T) => React.ReactNode
  type?: "range" | "select" | "ratio"
  align?: "left" | "center" | "right"
  getOptionLabel?: (value: string) => string
  width?: string | number
}

export type { Column }

interface ResponsiveTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  maxHeightDesktop?: number
  mobileCardRender?: (item: T, index: number) => React.ReactNode
  specialButtons?: React.ReactNode
  loading?: boolean
}

interface FilterState {
  [key: string]: Set<string> | { min: number; max: number; current: [number, number] }
}

function toStringOrNode(val: unknown): React.ReactNode {
  if (val === null || val === undefined) return ""
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return String(val)
  if (typeof val === "object" && React.isValidElement(val)) return val
  return String(val)
}

export default function ResponsiveTable<T extends Record<string, unknown>>({
  columns,
  data,
  maxHeightDesktop = 269,
  specialButtons,
  mobileCardRender,
  loading = false,
}: ResponsiveTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false)
  const [sortedData, setSortedData] = useState<T[]>([...data])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [filterState, setFilterState] = useState<FilterState>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [availableFilters, setAvailableFilters] = useState<{
    [key: string]: Set<string> | { min: number; max: number }
  }>({})

  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [checkIfMobile])

  useEffect(() => {
    const filters: { [key: string]: Set<string> | { min: number; max: number } } = {}

    columns.forEach((column) => {
      if (!column.type || column.key === "actions" || column.key === "checkbox") {
        return
      }

      if (column.type === "range") {
        let min = Number.POSITIVE_INFINITY
        let max = Number.NEGATIVE_INFINITY

        data.forEach((item) => {
          const value = Number.parseFloat(String(item[column.key as keyof T]))
          if (!Number.isNaN(value)) {
            min = Math.min(min, value)
            max = Math.max(max, value)
          }
        })

        if (min !== Number.POSITIVE_INFINITY && max !== Number.NEGATIVE_INFINITY) {
          filters[column.key] = { min, max }
        }
      } else if (column.type === "select" || column.type === "ratio") {
        const uniqueValues = new Set<string>()

        data.forEach((item) => {
          const value = item[column.key as keyof T]
          if (value !== undefined && value !== null) {
            uniqueValues.add(String(value))
          } else if (value === null) {
            uniqueValues.add("null")
          } else if (value === undefined) {
            uniqueValues.add("undefined")
          }
        })

        if (uniqueValues.size > 0) {
          filters[column.key] = uniqueValues
        }
      }
    })

    setAvailableFilters(filters)
  }, [data, columns])

  useEffect(() => {
    let filtered = [...data]

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) => {
        return columns.some((column) => {
          if (column.key === "actions") return false

          const rawValue = item[column.key as keyof T]
          const searchableValue = rawValue !== null && rawValue !== undefined ? String(rawValue).toLowerCase() : ""

          return searchableValue.includes(searchTerm.toLowerCase())
        })
      })
    }

    // Apply filters
    Object.entries(filterState).forEach(([key, values]) => {
      const column = columns.find((col) => col.key === key)

      if (column?.type === "range" && "current" in values) {
        const [min, max] = (values as { current: [number, number] }).current
        filtered = filtered.filter((item) => {
          const itemValue = Number.parseFloat(String(item[key as keyof T]))
          return !Number.isNaN(itemValue) && itemValue >= min && itemValue <= max
        })
      } else if (values instanceof Set && values.size > 0) {
        filtered = filtered.filter((item) => {
          const itemValue = item[key as keyof T]

          if (itemValue === null && (values as Set<string>).has("null")) {
            return true
          }
          if (itemValue === undefined && (values as Set<string>).has("undefined")) {
            return true
          }

          return (values as Set<string>).has(String(itemValue))
        })
      }
    })

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T]
        const bValue = b[sortConfig.key as keyof T]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        const aStr = String(aValue)
        const bStr = String(bValue)
        return sortConfig.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
      })
    }

    setSortedData(filtered)
  }, [data, sortConfig, filterState, searchTerm, columns])

  const handleSort = useCallback(
    (key: string) => {
      let direction: "asc" | "desc" = "asc"
      if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc"
      }
      setSortConfig({ key, direction })
    },
    [sortConfig],
  )

  const serializedColumns = columns.map((column) => ({
    ...column,
    render: column.render
      ? (value: unknown, item: T) => {
          try {
            return column.render!(value, item)
          } catch (error) {
            console.error("Error rendering column:", error)
            return String(value)
          }
        }
      : undefined,
  }))

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search)
  }, [])

  const handleFilterChange = useCallback(
    (columnKey: string, value: string | [number, number], checked?: boolean) => {
      setFilterState((prev) => {
        const newState = { ...prev }
        const column = columns.find((col) => col.key === columnKey)

        if (column?.type === "range" && Array.isArray(value)) {
          const rangeFilter = availableFilters[columnKey] as { min: number; max: number }
          newState[columnKey] = {
            min: rangeFilter.min,
            max: rangeFilter.max,
            current: value as [number, number],
          }
        } else if (column?.type === "select") {
          newState[columnKey] = new Set([value as string])
        } else if (checked !== undefined) {
          if (!newState[columnKey]) {
            newState[columnKey] = new Set<string>()
          }

          if (checked) {
            ;(newState[columnKey] as Set<string>).add(value as string)
          } else {
            ;(newState[columnKey] as Set<string>).delete(value as string)
            if ((newState[columnKey] as Set<string>).size === 0) {
              delete newState[columnKey]
            }
          }
        }

        return newState
      })
    },
    [columns, availableFilters],
  )

  const getDisplayValue = useCallback((value: string) => {
    if (value === "true") return <span className="!text-black">Active</span>
    if (value === "false") return <span className="!text-black">Inactive</span>
    if (value === "null" || value === "undefined") return <span className="!text-black">Pending</span>
    return <span className="!text-black">{value}</span>
  }, [])

  const getActiveFilterDescriptions = useCallback(() => {
    const descriptions: string[] = []

    if (searchTerm.trim() !== "") {
      descriptions.push(`Search: "${searchTerm}"`)
    }

    Object.entries(filterState).forEach(([columnKey, values]) => {
      const column = columns.find((col) => col.key === columnKey)
      if (!column) return

      if (column.type === "range" && "current" in values) {
        const [min, max] = (values as { current: [number, number] }).current
        descriptions.push(`${column.title}: ${min} - ${max}`)
      } else if (values instanceof Set && values.size > 0) {
        const valueList = Array.from(values)
          .map((value) => (column.getOptionLabel ? column.getOptionLabel(value) : getDisplayValue(value)))
          .join(", ")
        descriptions.push(`${column.title}: ${valueList}`)
      }
    })

    return descriptions
  }, [searchTerm, filterState, columns, getDisplayValue])

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const getColumnWidths = useCallback(() => {
    const totalColumns = columns.length
    const columnsWithWidth = columns.filter((col) => col.width)
    const columnsWithoutWidth = columns.filter((col) => !col.width)

    if (columnsWithWidth.length === 0) {
      // All columns equal width
      const equalWidth = `${100 / totalColumns}%`
      return columns.reduce(
        (acc, col) => {
          acc[col.key] = equalWidth
          return acc
        },
        {} as Record<string, string>,
      )
    }

    // Calculate used width from defined columns
    let usedWidth = 0
    const widthMap: Record<string, string> = {}

    columnsWithWidth.forEach((col) => {
      const width = typeof col.width === "number" ? `${col.width}px` : col.width!
      widthMap[col.key] = width

      // Convert to percentage for calculation (approximate)
      if (typeof col.width === "number") {
        usedWidth += (col.width / 1200) * 100 // Assume 1200px base width
      } else if (col.width!.includes("%")) {
        usedWidth += Number.parseFloat(col.width!.replace("%", ""))
      } else if (col.width!.includes("px")) {
        usedWidth += (Number.parseFloat(col.width!.replace("px", "")) / 1200) * 100
      }
    })

    // Distribute remaining width equally among columns without defined width
    const remainingWidth = Math.max(0, 100 - usedWidth)
    const equalWidthForRemaining =
      columnsWithoutWidth.length > 0 ? `${remainingWidth / columnsWithoutWidth.length}%` : "0%"

    columnsWithoutWidth.forEach((col) => {
      widthMap[col.key] = equalWidthForRemaining
    })

    return widthMap
  }, [columns])

  const columnWidths = getColumnWidths()

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {(Object.keys(filterState).length > 0 || searchTerm.trim() !== "") && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-1 cursor-help">
                    <span>
                      {Object.keys(filterState).length + (searchTerm.trim() !== "" ? 1 : 0)}{" "}
                      {Object.keys(filterState).length + (searchTerm.trim() !== "" ? 1 : 0) === 1
                        ? "filter"
                        : "filters"}{" "}
                      active
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-primary-foreground/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilterState({})
                        setSearchTerm("")
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">Active Filters:</p>
                    {getActiveFilterDescriptions().map((description, index) => (
                      <p key={index} className="text-sm">
                        • {description}
                      </p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="text-sm text-muted-foreground bg-transparent">
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px] pr-4">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>Filter Data</SheetTitle>
                <SheetDescription>Select values to filter the table</SheetDescription>
              </SheetHeader>

              <div className="py-4 space-y-6">
                {Object.entries(availableFilters).map(([columnKey, values]) => {
                  const column = columns.find((col) => col.key === columnKey)
                  if (!column || !column.type) return null

                  if (column.type === "range" && "min" in values) {
                    const rangeValues = values as { min: number; max: number }
                    const currentRange: [number, number] = filterState[columnKey]
                      ? (filterState[columnKey] as { current: [number, number] }).current
                      : [rangeValues.min, rangeValues.max]

                    return (
                      <div key={columnKey} className="space-y-3">
                        <h3 className="font-medium">{column.title}</h3>
                        <DualRangeSlider
                          min={rangeValues.min}
                          max={rangeValues.max}
                          value={currentRange}
                          onChange={(newRange) => handleFilterChange(columnKey, newRange)}
                          step={(rangeValues.max - rangeValues.min) / 100}
                        />
                      </div>
                    )
                  } else if (column.type === "ratio") {
                    return (
                      <div key={columnKey} className="space-y-3">
                        <h3 className="font-medium">{column.title}</h3>
                        <RadioGroup
                          defaultValue={(filterState[columnKey] as Set<string>)?.values().next().value || ""}
                          onValueChange={(value) => {
                            setFilterState((prev) => {
                              const newState = { ...prev }
                              newState[columnKey] = new Set([value])
                              return newState
                            })
                          }}
                          className="space-y-2"
                        >
                          {Array.from(values as Set<string>).map((value) => (
                            <div key={`${columnKey}-${value}`} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={value}
                                id={`mobile-${columnKey}-${value}`}
                                checked={(filterState[columnKey] as Set<string>)?.has(value) || false}
                              />
                              <Label
                                htmlFor={`mobile-${columnKey}-${value}`}
                                className="text-sm cursor-pointer !text-black"
                              >
                                {typeof getDisplayValue(value) === "object"
                                  ? getDisplayValue(value)
                                  : getDisplayValue(value)}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )
                  } else if (column.type === "select") {
                    return (
                      <div key={columnKey} className="space-y-3">
                        <h3 className="font-medium">{column.title}</h3>
                        <Select
                          onValueChange={(value) => handleFilterChange(columnKey, value)}
                          value={(filterState[columnKey] as Set<string>)?.values().next().value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Select ${column.title}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{column.title}</SelectLabel>
                              {Array.from(values as Set<string>).map((value) => (
                                <SelectItem key={`mobile-${columnKey}-${value}`} value={value}>
                                  <span className="!text-black">
                                    {column.getOptionLabel
                                      ? column.getOptionLabel(value)
                                      : typeof getDisplayValue(value) === "object"
                                        ? getDisplayValue(value)
                                        : getDisplayValue(value)}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  }

                  return null
                })}

                {Object.keys(filterState).length > 0 && (
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setFilterState({})}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          </div>
        ) : sortedData.length > 0 ? (
          <>
            {sortedData.map((item, index) => (
              <div key={index}>
                {mobileCardRender ? (
                  (() => {
                    try {
                      return mobileCardRender(item, index)
                    } catch (error) {
                      console.error("Error rendering mobile card:", error)
                      return null
                    }
                  })()
                ) : (
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      {serializedColumns.map((column) => (
                        <div key={column.key} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-muted-foreground">{column.title}:</span>
                          <div className="text-right !text-black">
                            {column.render
                              ? column.render(item[column.key as keyof T], item)
                              : toStringOrNode(item[column.key as keyof T])}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
            <MobilePagination
              currentPage={currentPage}
              totalPages={totalPages}
              currentMembers={sortedData.length}
              totalMembers={data.length}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
            />
          </>
        ) : (
          <Card className="py-8">
            <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
              <Search className="h-10 w-10 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search criteria</p>
              {Object.keys(filterState).length > 0 && (
                <Button variant="outline" className="mt-2 bg-transparent" onClick={() => setFilterState({})}>
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div className="relative w-[30%]">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {(Object.keys(filterState).length > 0 || searchTerm.trim() !== "") && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-1 cursor-help">
                  <span>
                    {Object.keys(filterState).length + (searchTerm.trim() !== "" ? 1 : 0)}{" "}
                    {Object.keys(filterState).length + (searchTerm.trim() !== "" ? 1 : 0) === 1 ? "filter" : "filters"}{" "}
                    active
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-primary-foreground/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilterState({})
                      setSearchTerm("")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">Active Filters:</p>
                  {getActiveFilterDescriptions().map((description, index) => (
                    <p key={index} className="text-sm">
                      • {description}
                    </p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="flex space-x-2">
          {specialButtons}
          {Object.keys(availableFilters).length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="text-sm text-muted-foreground bg-transparent">
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto pr-9">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="mb-0">Filter Data</SheetTitle>
                  <SheetDescription>Select values to filter the table</SheetDescription>
                </SheetHeader>

                <div className="py-4 space-y-4">
                  {Object.entries(availableFilters).map(([columnKey, values]) => {
                    const column = columns.find((col) => col.key === columnKey)
                    if (!column || !column.type) return null

                    if (column.type === "range" && "min" in values) {
                      const rangeValues = values as { min: number; max: number }
                      const currentRange: [number, number] = filterState[columnKey]
                        ? (filterState[columnKey] as { current: [number, number] }).current
                        : [rangeValues.min, rangeValues.max]

                      return (
                        <div key={columnKey} className="space-y-3">
                          <h3 className="font-medium">{column.title}</h3>
                          <DualRangeSlider
                            min={rangeValues.min}
                            max={rangeValues.max}
                            value={currentRange}
                            onChange={(newRange) => handleFilterChange(columnKey, newRange)}
                            step={(rangeValues.max - rangeValues.min) / 100}
                          />
                        </div>
                      )
                    } else if (column.type === "ratio") {
                      return (
                        <div key={columnKey} className="space-y-3">
                          <h3 className="font-medium">{column.title}</h3>
                          <RadioGroup
                            defaultValue={(filterState[columnKey] as Set<string>)?.values().next().value || ""}
                            onValueChange={(value) => {
                              setFilterState((prev) => {
                                const newState = { ...prev }
                                newState[columnKey] = new Set([value])
                                return newState
                              })
                            }}
                            className="space-y-2"
                          >
                            {Array.from(values as Set<string>).map((value) => (
                              <div key={`${columnKey}-${value}`} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={value}
                                  id={`${columnKey}-${value}`}
                                  checked={(filterState[columnKey] as Set<string>)?.has(value) || false}
                                />
                                <Label htmlFor={`${columnKey}-${value}`} className="text-sm cursor-pointer !text-black">
                                  {typeof getDisplayValue(value) === "object"
                                    ? getDisplayValue(value)
                                    : getDisplayValue(value)}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )
                    } else if (column.type === "select") {
                      return (
                        <div key={columnKey} className="space-y-3">
                          <h3 className="font-medium">{column.title}</h3>
                          <Select
                            onValueChange={(value) => handleFilterChange(columnKey, value)}
                            value={(filterState[columnKey] as Set<string>)?.values().next().value || ""}
                          >
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder={`Select ${column.title}`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>{column.title}</SelectLabel>
                                {Array.from(values as Set<string>).map((value) => (
                                  <SelectItem key={`${columnKey}-${value}`} value={value} className="cursor-pointer">
                                    <span className="!text-black">
                                      {column.getOptionLabel
                                        ? column.getOptionLabel(value)
                                        : typeof getDisplayValue(value) === "object"
                                          ? getDisplayValue(value)
                                          : getDisplayValue(value)}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    return null
                  })}

                  {Object.keys(filterState).length > 0 && (
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setFilterState({})}>
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </div>
      ) : sortedData.length > 0 ? (
        <div
          className="rounded-md border border-border max-h-[calc(100vh-269px)] overflow-y-auto"
          style={{ maxHeight: `calc(100vh - ${maxHeightDesktop}px)` }}
        >
          <Table>
            <TableHeader className="bg-background sticky top-0 z-10">
              <TableRow className="border-border bg-muted/50">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="cursor-pointer"
                    onClick={() => handleSort(column.key)}
                    style={{ width: columnWidths[column.key] }}
                  >
                    <div
                      className={`flex items-center text-muted-foreground select-none gap-2 ${
                        column.align === "center"
                          ? "justify-center"
                          : column.align === "right"
                            ? "justify-end"
                            : "justify-start"
                      } ${column.key === "actions" && "justify-center"}`}
                    >
                      {column.title}
                      {column.key !== "actions" &&
                        column.key !== "checkbox" &&
                        (sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <MoveUp size={16} />
                          ) : (
                            <MoveDown size={16} />
                          )
                        ) : (
                          <ArrowDownUp size={16} />
                        ))}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="border-border">
                  {columns.length > 0 ? (
                    columns.map((column) => (
                      <TableCell key={`${rowIndex}-${column.key}`} style={{ width: columnWidths[column.key] }}>
                        <div
                          className={`flex items-center gap-2 ${
                            column.align === "center"
                              ? "justify-center"
                              : column.align === "right"
                                ? "justify-end"
                                : "justify-start"
                          } ${column.key === "actions" && "justify-center"} !text-black`}
                          style={{ color: "#000000 !important" }}
                        >
                          {column.render
                            ? column.render(item[column.key as keyof T], item)
                            : toStringOrNode(item[column.key as keyof T])}
                        </div>
                      </TableCell>
                    ))
                  ) : (
                    <TableCell colSpan={columns.length} className="text-center">
                      No data
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border max-h-[calc(100vh-269px)] overflow-y-auto">
          <Table>
            <TableHeader className="bg-background sticky top-0 z-10">
              <TableRow className="border-border bg-muted/50">
                {columns.map((column) => (
                  <TableHead key={column.key} className="cursor-pointer" style={{ width: columnWidths[column.key] }}>
                    <div
                      className={`flex items-center gap-2 text-center ${column.key === "actions" && "justify-center"}`}
                    >
                      {column.title}
                      {column.key !== "actions" &&
                        column.key !== "checkbox" &&
                        (sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <MoveUp size={16} />
                          ) : (
                            <MoveDown size={16} />
                          )
                        ) : (
                          <ArrowDownUp size={16} />
                        ))}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-10 w-10 text-muted-foreground opacity-50" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search criteria</p>
                    {Object.keys(filterState).length > 0 && (
                      <Button variant="outline" className="mt-2 bg-transparent" onClick={() => setFilterState({})}>
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <DesktopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentMembers={sortedData.length}
        totalMembers={data.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  currentMembers: number
  totalMembers: number
}

function MobilePagination({
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  currentMembers,
  totalMembers,
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, currentMembers)

  return (
    <div className="flex items-center justify-between space-x-2">
      <p className="text-xs text-muted-foreground">
        Showing {startIndex}-{endIndex} of {totalMembers} results
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="text-xs"
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="text-xs"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function DesktopPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  currentMembers,
  totalMembers,
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, currentMembers)

  return (
    <div className="flex items-center justify-between space-x-2">
      <p className="text-xs text-muted-foreground">
        Showing {startIndex}-{endIndex} of {totalMembers} results
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="text-xs"
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="text-xs"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
