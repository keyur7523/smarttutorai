"use client"

import { Progress } from "@/components/ui/progress"

interface QuestionProgressProps {
  current: number
  total: number
  className?: string
}

export function QuestionProgress({ current, total, className }: QuestionProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-muted-foreground">
          Q{current} / {total}
        </span>
      </div>
      <Progress 
        value={progress} 
        className="h-2"
        aria-label={`Question ${current} of ${total}`}
      />
    </div>
  )
}
