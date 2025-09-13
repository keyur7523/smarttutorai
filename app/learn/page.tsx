'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/session'
import { ProblemCard } from '@/components/ProblemCard'
import { HistoryList } from '@/components/HistoryList'
import { PerformanceIndicator } from '@/components/PerformanceIndicator'
import { QuestionProgress } from '@/components/QuestionProgress'
import { LevelBadge } from '@/components/LevelBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RotateCcw, X } from 'lucide-react'
import Link from 'next/link'


const SESSION_LIMIT = 10

export default function LearnPage() {
  const {
    problems,
    history,
    currentLevel,
    currentProblem,
    isSubmitting,
    feedback,
    hints,
    dynamicHints,
    currentHintIndex,
    isLoadingHint,
    sessionComplete,
    sessionId,
    setProblems,
    loadNextProblem,
    submitAnswer,
    requestHint,
    clearSession
  } = useSessionStore()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('📚 Learn page mounted - loading problems')
    console.log('📊 Current problems count:', problems.length)
    
    if (problems.length === 0) {
      console.log('📚 No problems loaded - fetching from server')
      loadProblems()
    } else {
      console.log('📚 Problems already loaded - skipping fetch')
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('🔄 useEffect triggered - checking conditions:', {
      problemsLength: problems.length,
      currentProblem: currentProblem?.id || 'none',
      sessionComplete
    })
    
    if (problems.length > 0 && !currentProblem && !sessionComplete) {
      console.log('✅ Conditions met - loading next problem')
      loadNextProblem()
    } else {
      console.log('❌ Conditions not met - skipping loadNextProblem')
    }
  }, [problems, currentProblem, sessionComplete])


  const loadProblems = async () => {
    try {
      console.log('📚 Loading problems from /api/problems')
      const response = await fetch('/api/problems')
      if (response.ok) {
        const problemsData = await response.json()
        console.log('✅ Loaded', problemsData.length, 'problems')
        console.log('📊 Setting problems in store')
        setProblems(problemsData)
        console.log('📊 Problems set in store')
      } else {
        console.error('❌ Failed to load problems:', response.status)
      }
    } catch (error) {
      console.error('❌ Error loading problems:', error)
    } finally {
      console.log('🏁 Setting isLoading to false')
      setIsLoading(false)
    }
  }

  const handleAnswer = async (answer: string) => {
    await submitAnswer(answer)
  }

  const handleHint = async (hintIndex: number) => {
    await requestHint()
  }

  const startNewSession = () => {
    clearSession()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problems...</p>
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Session Complete! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              You've completed {SESSION_LIMIT} problems. Great job!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PerformanceIndicator />
            <HistoryList history={history} maxItems={SESSION_LIMIT} />
          </div>

          <div className="text-center mt-8 space-x-4">
            <Button onClick={startNewSession} size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Session
            </Button>
            <Link href="/summary">
              <Button variant="outline" size="lg">
                View Summary
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Session</h1>
            <p className="text-gray-600">Adaptive fraction tutoring</p>
          </div>
          <div className="flex items-center gap-4">
            <LevelBadge level={currentLevel} size="lg" />
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: History List + Session Progress */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionProgress 
                  current={Math.min(history.length + 1, SESSION_LIMIT)} 
                  total={SESSION_LIMIT} 
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Current Level: {currentLevel}</p>
                  <p>Problems Completed: {history.length}/{SESSION_LIMIT}</p>
                </div>
              </CardContent>
            </Card>

            <HistoryList history={history} maxItems={5} />
          </div>

          {/* Center Column: Problem Card (main content) */}
          <div className="lg:col-span-6">
            {currentProblem ? (
              <ProblemCard
                problem={currentProblem}
                onSubmit={handleAnswer}
                onHint={handleHint}
                feedback={feedback}
                isSubmitting={isSubmitting}
                disabled={isSubmitting}
                hints={hints}
                currentHintIndex={currentHintIndex}
                dynamicHints={dynamicHints}
                isLoadingHint={isLoadingHint}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading next problem...</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Performance Indicator (always visible) */}
          <div className="lg:col-span-3">
            <PerformanceIndicator />
          </div>
        </div>
      </div>
    </div>
  )
}