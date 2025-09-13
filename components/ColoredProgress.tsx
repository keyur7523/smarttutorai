"use client"

interface ColoredProgressProps {
  value: number
  className?: string
  colorFn: (value: number) => string
}

/**
 * Custom ColoredProgress component with exact specifications:
 * - Custom color function for dynamic coloring
 * - Smooth transitions
 * - Proper accessibility
 */
export const ColoredProgress = ({ value, className, colorFn }: ColoredProgressProps) => {
  const safeValue = Math.min(100, Math.max(0, value))
  
  return (
    <div className={`w-full bg-gray-200 rounded-full ${className || ''}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorFn(safeValue)}`}
        style={{ width: `${safeValue}%` }}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${Math.round(safeValue)}%`}
      />
    </div>
  )
}
