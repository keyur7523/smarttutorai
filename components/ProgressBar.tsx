"use client"

import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  value: number | undefined
  label?: string
  showPercentage?: boolean
  className?: string
  color?: 'default' | 'success' | 'warning' | 'danger' | 'green' | 'yellow' | 'red'
}

export function ProgressBar({ 
  value, 
  label, 
  showPercentage = true, 
  className,
  color = 'default'
}: ProgressBarProps) {
  // Ensure value is a valid number
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
      case 'success':
        return 'bg-green-500'
      case 'yellow':
      case 'warning':
        return 'bg-yellow-500'
      case 'red':
      case 'danger':
        return 'bg-red-500'
      case 'default':
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="font-medium">
              {safeValue.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <Progress 
          value={safeValue} 
          className="h-2"
          aria-label={label ? `${label}: ${safeValue.toFixed(0)}%` : undefined}
        />
        <div
          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getColorClasses(color)}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}