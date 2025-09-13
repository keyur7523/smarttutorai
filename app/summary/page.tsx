"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ProgressBar"
import { LevelBadge } from "@/components/LevelBadge"
import { useSessionStore } from "@/store/session"
import { deriveMetrics, Metrics } from "@/lib/metrics"
import { weakAreas, generateInsights } from "@/lib/summary"
import { formatTime } from "@/lib/utils"
import { Trophy, BookOpen, TrendingUp, Target, Lightbulb, Clock, CheckCircle, XCircle } from "lucide-react"

export default function SummaryPage() {
  const router = useRouter()
  const { history, currentLevel, clearSession } = useSessionStore()
  const [studyPlan, setStudyPlan] = useState<{ plan: string[]; challenge: string } | null>(null)
  const [isLoadingPlan, setIsLoadingPlan] = useState(false)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [weakAreasList, setWeakAreasList] = useState<string[]>([])
  const [insights, setInsights] = useState<{ strengths: string[], improvements: string[] }>({ strengths: [], improvements: [] })

  // Redirect if no session data
  useEffect(() => {
    if (history.length === 0) {
      router.push("/")
    }
  }, [history, router])

  // Calculate metrics and generate insights
  useEffect(() => {
    if (history.length > 0) {
      const calculatedMetrics = deriveMetrics(history)
      setMetrics(calculatedMetrics)
      
      const weakAreasData = weakAreas(history)
      setWeakAreasList(weakAreasData)
      
      const insightsData = generateInsights(history)
      setInsights(insightsData)
    }
  }, [history])

  // Generate study plan on mount
  useEffect(() => {
    const generatePlan = async () => {
      if (history.length === 0) return

      setIsLoadingPlan(true)
      try {
        const response = await fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history,
            currentLevel
          })
        })

        if (response.ok) {
          const data = await response.json()
          setStudyPlan(data)
        } else {
          throw new Error('Failed to fetch study plan')
        }
      } catch (error) {
        console.error("Failed to generate study plan:", error)
        // Fallback plan
        setStudyPlan({
          plan: [
            "Review the problems you found challenging",
            "Practice similar problems to reinforce learning",
            "Focus on understanding concepts rather than memorizing",
            "Try solving problems without hints first",
            "Keep practicing regularly to maintain your skills",
          ],
          challenge: "Great work today."
        })
      } finally {
        setIsLoadingPlan(false)
      }
    }

    generatePlan()
  }, [history, currentLevel])

  const handleNewSession = () => {
    clearSession()
    router.push("/learn")
  }

  const handleHome = () => {
    clearSession()
    router.push("/")
  }

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>No session data found. Please start a new session.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculating performance metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Session Complete!</h1>
          </div>
          <p className="text-lg text-gray-600">
            Great work! You completed {history.length} problems with {metrics.accuracy}% accuracy.
          </p>
        </div>

        {/* Single Column Stacked Layout */}
        <div className="space-y-6">
          {/* Session Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Session Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{metrics.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                  <ProgressBar value={metrics.accuracy} color="blue" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{metrics.streak}</div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatTime(metrics.avgTimeMs)}</div>
                  <div className="text-sm text-muted-foreground">Average Time</div>
                </div>
              </div>

              {/* Per Level Performance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Per Level Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <LevelBadge level="easy" />
                      <span className="text-sm text-muted-foreground">({history.filter(h => h.levelAtTime === 'easy').length} problems)</span>
                    </div>
                    <ProgressBar value={metrics.perLevel.easy} color="green" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <LevelBadge level="medium" />
                      <span className="text-sm text-muted-foreground">({history.filter(h => h.levelAtTime === 'medium').length} problems)</span>
                    </div>
                    <ProgressBar value={metrics.perLevel.medium} color="yellow" />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <LevelBadge level="hard" />
                      <span className="text-sm text-muted-foreground">({history.filter(h => h.levelAtTime === 'hard').length} problems)</span>
                    </div>
                    <ProgressBar value={metrics.perLevel.hard} color="red" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Strengths</h4>
                  <ul className="space-y-2 text-sm">
                    {insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Areas for Improvement</h4>
                  <ul className="space-y-2 text-sm">
                    {insights.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weak Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weak Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {weakAreasList.map((area, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Study Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Personalized Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPlan ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Generating your personalized study plan...</span>
                </div>
              ) : studyPlan ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {studyPlan.plan.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Challenge Problem</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      {studyPlan.challenge.includes('(Hint:') ? (
                        <>
                          {studyPlan.challenge.split('(Hint:')[0]}
                          <br />
                          <span className="text-xs text-blue-600 mt-1 block">
                            Hint: {studyPlan.challenge.split('(Hint:')[1].replace(')', '')}
                          </span>
                        </>
                      ) : (
                        studyPlan.challenge
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Unable to generate study plan. Please try again later.</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleNewSession} size="lg" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Start New Session
            </Button>
            <Button onClick={handleHome} variant="outline" size="lg" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}