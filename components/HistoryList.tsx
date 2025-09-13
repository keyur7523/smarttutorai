"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Lightbulb } from "lucide-react"
import { formatTime, formatDate } from "@/lib/utils"
import type { HistoryItem } from "@/store/types"

interface HistoryListProps {
  history: HistoryItem[]
  maxItems?: number
}

export function HistoryList({ history, maxItems = 10 }: HistoryListProps) {
  const recentHistory = history.slice(-maxItems).reverse()

  const getLevelColor = (level: string) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (recentHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No attempts yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Attempts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentHistory.map((item, index) => (
          <div
            key={`${item.problemId}-${item.submittedAt}`}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              {item.correct ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <div>
                <p className="text-sm font-medium">Problem {item.problemId}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(item.timeMs)}
                  {item.usedHint && (
                    <span className="flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      Hint used
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${getLevelColor(item.levelAtTime)} text-xs`}>
                {item.levelAtTime}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(item.submittedAt)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}