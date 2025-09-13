"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ProgressBar"
import { useSessionStore } from "@/store/session"
import { MetricsCalculator } from "@/lib/metrics"
import { formatTime } from "@/lib/utils"
import { Trophy, Target, Zap, Clock, TrendingUp, Award } from "lucide-react"

export function PerformanceSummary() {
  const { history, getPerformanceMetrics } = useSessionStore()
  const metrics = getPerformanceMetrics()

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Complete some problems to see your performance summary!</p>
        </CardContent>
      </Card>
    )
  }

  const performanceLevel = MetricsCalculator.getPerformanceLevel(metrics.overallAccuracy)
  const speedLevel = MetricsCalculator.getSpeedLevel(metrics.speedScore)

  const getPerformanceIcon = () => {
    if (performanceLevel === "excellent") return <Trophy className="h-6 w-6 text-yellow-500" />
    if (performanceLevel === "good") return <Award className="h-6 w-6 text-blue-500" />
    return <Target className="h-6 w-6 text-gray-500" />
  }

  const getPerformanceMessage = () => {
    if (metrics.overallAccuracy >= 90) return "Outstanding performance! You're mastering these concepts."
    if (metrics.overallAccuracy >= 80) return "Excellent work! You're doing very well."
    if (metrics.overallAccuracy >= 70) return "Good job! Keep practicing to improve further."
    if (metrics.overallAccuracy >= 60) return "You're making progress! Focus on understanding the concepts."
    return "Keep practicing! Every problem helps you learn."
  }

  const getSpeedMessage = () => {
    if (metrics.speedScore >= 80) return "Lightning fast! Great problem-solving speed."
    if (metrics.speedScore >= 60) return "Good pace! You're solving problems efficiently."
    if (metrics.speedScore >= 40) return "Steady progress! Take your time to understand."
    return "Focus on accuracy first, speed will come with practice."
  }

  const strongestLevel = Math.max(metrics.easyAccuracy, metrics.mediumAccuracy, metrics.hardAccuracy)
  const weakestLevel = Math.min(metrics.easyAccuracy, metrics.mediumAccuracy, metrics.hardAccuracy)

  const getLevelName = (accuracy: number) => {
    if (accuracy === metrics.easyAccuracy) return "Easy"
    if (accuracy === metrics.mediumAccuracy) return "Medium"
    return "Hard"
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPerformanceIcon()}
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{Math.round(metrics.overallAccuracy)}%</div>
              <div className="text-sm text-blue-700">Overall Accuracy</div>
              <Badge variant="outline" className="mt-2">
                {performanceLevel === "excellent" ? "Excellent" : performanceLevel === "good" ? "Good" : "Improving"}
              </Badge>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{metrics.currentStreak}</div>
              <div className="text-sm text-green-700">Current Streak</div>
              <Badge variant="outline" className="mt-2">
                {metrics.currentStreak >= 5 ? "Hot Streak!" : metrics.currentStreak >= 3 ? "On Fire!" : "Building"}
              </Badge>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{Math.round(metrics.speedScore)}</div>
              <div className="text-sm text-purple-700">Speed Score</div>
              <Badge variant="outline" className="mt-2">
                {speedLevel === "fast" ? "Fast" : speedLevel === "moderate" ? "Steady" : "Careful"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {getPerformanceMessage()}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {getSpeedMessage()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Level Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Level Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar value={metrics.easyAccuracy} label="Easy Problems" color="green" showPercentage={true} />
          <ProgressBar value={metrics.mediumAccuracy} label="Medium Problems" color="yellow" showPercentage={true} />
          <ProgressBar value={metrics.hardAccuracy} label="Hard Problems" color="red" showPercentage={true} />

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Strongest Level</div>
              <div className="font-semibold text-green-600">{getLevelName(strongestLevel)}</div>
              <div className="text-sm">{Math.round(strongestLevel)}% accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Focus Area</div>
              <div className="font-semibold text-orange-600">{getLevelName(weakestLevel)}</div>
              <div className="text-sm">{Math.round(weakestLevel)}% accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{metrics.totalProblems}</div>
              <div className="text-xs text-muted-foreground">Problems Solved</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{history.filter((h) => h.correct).length}</div>
              <div className="text-xs text-muted-foreground">Correct Answers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatTime(metrics.averageTime)}</div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{history.filter((h) => h.usedHints).length}</div>
              <div className="text-xs text-muted-foreground">Hints Used</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
