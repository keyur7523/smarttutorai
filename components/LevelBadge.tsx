"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface LevelBadgeProps {
  level: "easy" | "medium" | "hard"
  size?: "sm" | "md" | "lg"
  showTrend?: boolean
  previousLevel?: "easy" | "medium" | "hard"
}

export function LevelBadge({ level, size = "md", showTrend = false, previousLevel }: LevelBadgeProps) {
  const getLevelColor = (level: "easy" | "medium" | "hard") => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
    }
  }

  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1"
      case "md":
        return "text-sm px-3 py-1"
      case "lg":
        return "text-base px-4 py-2"
    }
  }

  const getTrendIcon = () => {
    if (!showTrend || !previousLevel) return null

    const levelOrder = { easy: 0, medium: 1, hard: 2 }
    const currentOrder = levelOrder[level]
    const previousOrder = levelOrder[previousLevel]

    if (currentOrder > previousOrder) {
      return <TrendingUp className="h-3 w-3 text-green-600" />
    } else if (currentOrder < previousOrder) {
      return <TrendingDown className="h-3 w-3 text-red-600" />
    } else {
      return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  return (
    <Badge 
      className={`${getLevelColor(level)} ${getSizeClasses(size)} flex items-center gap-1 rounded-full border transition-colors`}
      aria-label={`Current level: ${level}`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
      {getTrendIcon()}
    </Badge>
  )
}