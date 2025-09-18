"use client"

import React, { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface DualRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  className?: string
}

export function DualRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  className,
}: DualRangeSliderProps) {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)

  const handleMouseDown = useCallback((type: 'min' | 'max') => {
    setIsDragging(type)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const percentage = (e.clientX - rect.left) / rect.width
    const newValue = min + (max - min) * Math.max(0, Math.min(1, percentage))
    const steppedValue = Math.round(newValue / step) * step

    if (isDragging === 'min') {
      const newMin = Math.min(steppedValue, value[1])
      onChange([newMin, value[1]])
    } else {
      const newMax = Math.max(steppedValue, value[0])
      onChange([value[0], newMax])
    }
  }, [isDragging, min, max, step, value, onChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const minPercentage = ((value[0] - min) / (max - min)) * 100
  const maxPercentage = ((value[1] - min) / (max - min)) * 100

  return (
    <div className={cn("relative h-6", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-blue-500 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
        </div>
      </div>
      
      <div
        className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer transform -translate-y-1"
        style={{ left: `calc(${minPercentage}% - 8px)` }}
        onMouseDown={() => handleMouseDown('min')}
      />
      
      <div
        className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer transform -translate-y-1"
        style={{ left: `calc(${maxPercentage}% - 8px)` }}
        onMouseDown={() => handleMouseDown('max')}
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  )
}
