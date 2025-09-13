"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSessionStore } from "@/store/session"
import { formatTime } from "@/lib/utils"
import { Play, Pause, RotateCcw, Target, Zap } from "lucide-react"

interface SessionManagerProps {
  maxProblems?: number
  onSessionComplete?: () => void
}

export function SessionManager({ maxProblems = 10, onSessionComplete }: SessionManagerProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [sessionStartTime] = useState(Date.now())

  const { history, currentLevel, sessionStarted, resetSession, getPerformanceMetrics } = useSessionStore()

  const metrics = getPerformanceMetrics()
  const progress = (history.length / maxProblems) * 100
  const sessionTimeElapsed = Date.now() - sessionStartTime

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
    // In a real implementation, you might want to pause the timer
  }

  const handleResetSession = () => {
    if (window.confirm("Are you sure you want to reset your session? All progress will be lost.")) {
      resetSession()
    }
  }

  const handleCompleteSession = () => {
    if (onSessionComplete) {
      onSessionComplete()
    }
  }

  if (!sessionStarted) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Session Progress
          </span>
          <Badge
            variant={currentLevel === "easy" ? "secondary" : currentLevel === "medium" ? "default" : "destructive"}
          >
            {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Problems Completed</span>
            <span>
              {history.length}/{maxProblems}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">{Math.round(metrics.overallAccuracy)}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">{metrics.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-600">{formatTime(sessionTimeElapsed)}</div>
            <div className="text-xs text-muted-foreground">Time</div>
          </div>
        </div>

        {/* Session Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseResume}
            className="flex items-center gap-2 bg-transparent"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetSession}
            className="flex items-center gap-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          {history.length >= maxProblems && (
            <Button onClick={handleCompleteSession} size="sm" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Complete
            </Button>
          )}
        </div>

        {/* Session Info */}
        <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Average Time per Problem</span>
            <span>{formatTime(metrics.averageTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hints Used</span>
            <span>{history.filter((h) => h.usedHints).length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
