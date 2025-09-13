"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ProgressBar"
import { LevelBadge } from "@/components/LevelBadge"
import { useSessionStore } from "@/store/session"
import { formatTime } from "@/lib/utils"
import { Target, Zap, TrendingUp, Clock } from "lucide-react"

export function PerformanceIndicator() {
  const { history, currentLevel } = useSessionStore()

  // Calculate metrics
  const totalProblems = history.length
  const correctAnswers = history.filter(h => h.correct).length
  const overallAccuracy = totalProblems > 0 ? (correctAnswers / totalProblems) * 100 : 0
  
  // Calculate speed score (inverse of average time, normalized)
  const averageTime = totalProblems > 0 
    ? history.reduce((sum, h) => sum + h.timeMs, 0) / totalProblems 
    : 0
  const speedScore = averageTime > 0 ? Math.max(0, 100 - (averageTime / 1000)) : 0

  // Calculate current streak
  let currentStreak = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].correct) {
      currentStreak++
    } else {
      break
    }
  }

  // Calculate per-level performance
  const easyHistory = history.filter(h => h.levelAtTime === 'easy')
  const mediumHistory = history.filter(h => h.levelAtTime === 'medium')
  const hardHistory = history.filter(h => h.levelAtTime === 'hard')

  const easyAccuracy = easyHistory.length > 0 
    ? (easyHistory.filter(h => h.correct).length / easyHistory.length) * 100 
    : 0
  const mediumAccuracy = mediumHistory.length > 0 
    ? (mediumHistory.filter(h => h.correct).length / mediumHistory.length) * 100 
    : 0
  const hardAccuracy = hardHistory.length > 0 
    ? (hardHistory.filter(h => h.correct).length / hardHistory.length) * 100 
    : 0

  return (
    <div className="space-y-4">
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(overallAccuracy)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(speedScore)}</div>
              <div className="text-xs text-muted-foreground">Speed Score</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Current Streak
              </span>
              <span className="font-medium">{currentStreak}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Avg Time
              </span>
              <span className="font-medium">{formatTime(averageTime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Level Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Current Level</span>
            <LevelBadge level={currentLevel} />
          </div>

          <div className="space-y-3">
            <ProgressBar 
              value={easyAccuracy} 
              label="Easy" 
              color="green" 
              showPercentage={true} 
            />
            <ProgressBar 
              value={mediumAccuracy} 
              label="Medium" 
              color="yellow" 
              showPercentage={true} 
            />
            <ProgressBar 
              value={hardAccuracy} 
              label="Hard" 
              color="red" 
              showPercentage={true} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Session Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">{totalProblems}</div>
              <div className="text-xs text-muted-foreground">Problems</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{Math.round(overallAccuracy)}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-muted-foreground mb-2">Recent Performance</div>
              <div className="flex gap-1">
                {history.slice(-10).map((item, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${item.correct ? "bg-green-500" : "bg-red-500"}`}
                    title={`Problem ${item.problemId}: ${item.correct ? "Correct" : "Incorrect"} (${formatTime(item.timeMs)})`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}