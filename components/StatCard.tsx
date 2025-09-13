"use client"

import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  color?: 'black' | 'green' | 'yellow' | 'red'
  className?: string
}

/**
 * StatCard component for displaying statistics with colored text
 */
export function StatCard({ title, value, color = 'black', className }: StatCardProps) {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600'
      case 'yellow':
        return 'text-yellow-600'
      case 'red':
        return 'text-red-600'
      case 'black':
      default:
        return 'text-gray-900'
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${getColorClass(color)}`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {title}
        </div>
      </CardContent>
    </Card>
  )
}
