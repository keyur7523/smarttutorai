"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play,
  RefreshCw,
  FileText,
  Zap
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'passed' | 'failed' | 'running' | 'pending'
  duration?: number
  error?: string
  category: 'adaptive' | 'session' | 'validation' | 'performance'
}

interface TestSuite {
  name: string
  tests: TestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
  duration: number
}

export function TestSpriteDashboard({ className }: { className?: string }) {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)

  // Mock test data - in real implementation, this would come from TestSprite
  const mockTestSuites: TestSuite[] = [
    {
      name: 'Adaptive Learning Algorithm',
      totalTests: 8,
      passedTests: 8,
      failedTests: 0,
      duration: 45,
      tests: [
        { name: 'should start at medium level and progress to hard', status: 'passed', duration: 12, category: 'adaptive' },
        { name: 'should demote from hard to medium after 2 consecutive wrong', status: 'passed', duration: 8, category: 'adaptive' },
        { name: 'should demote from hard to medium after 3 total wrong', status: 'passed', duration: 10, category: 'adaptive' },
        { name: 'should promote from easy to medium after 2 consecutive correct', status: 'passed', duration: 7, category: 'adaptive' },
        { name: 'should demote from medium to easy after 2 consecutive wrong', status: 'passed', duration: 9, category: 'adaptive' },
        { name: 'should maintain current level when conditions not met', status: 'passed', duration: 6, category: 'adaptive' },
        { name: 'should handle empty history gracefully', status: 'passed', duration: 5, category: 'adaptive' },
        { name: 'should handle large history efficiently', status: 'passed', duration: 15, category: 'performance' }
      ]
    },
    {
      name: 'Session Management',
      totalTests: 6,
      passedTests: 6,
      failedTests: 0,
      duration: 32,
      tests: [
        { name: 'should select appropriate level problems', status: 'passed', duration: 8, category: 'session' },
        { name: 'should avoid recently used problems', status: 'passed', duration: 6, category: 'session' },
        { name: 'should return null when no problems available', status: 'passed', duration: 4, category: 'session' },
        { name: 'should handle empty problems array', status: 'passed', duration: 3, category: 'session' },
        { name: 'should handle all problems being recent', status: 'passed', duration: 5, category: 'session' },
        { name: 'should handle large problem sets efficiently', status: 'passed', duration: 18, category: 'performance' }
      ]
    },
    {
      name: 'Answer Validation',
      totalTests: 12,
      passedTests: 12,
      failedTests: 0,
      duration: 28,
      tests: [
        { name: 'should accept correct multiple choice answer', status: 'passed', duration: 3, category: 'validation' },
        { name: 'should reject incorrect multiple choice answer', status: 'passed', duration: 4, category: 'validation' },
        { name: 'should handle case-insensitive answers', status: 'passed', duration: 2, category: 'validation' },
        { name: 'should handle whitespace in answers', status: 'passed', duration: 2, category: 'validation' },
        { name: 'should accept correct short answer', status: 'passed', duration: 3, category: 'validation' },
        { name: 'should reject incorrect short answer', status: 'passed', duration: 3, category: 'validation' },
        { name: 'should handle multiple correct answers', status: 'passed', duration: 4, category: 'validation' },
        { name: 'should handle empty answer', status: 'passed', duration: 2, category: 'validation' },
        { name: 'should handle problem with no answer key', status: 'passed', duration: 2, category: 'validation' },
        { name: 'should handle special characters in answers', status: 'passed', duration: 3, category: 'validation' },
        { name: 'should validate answers quickly', status: 'passed', duration: 12, category: 'performance' },
        { name: 'edge case handling', status: 'passed', duration: 2, category: 'validation' }
      ]
    }
  ]

  useEffect(() => {
    setTestSuites(mockTestSuites)
  }, [])

  const runTests = async () => {
    setIsRunning(true)
    setLastRun(new Date())

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update test results (in real implementation, this would come from TestSprite)
    setTestSuites(mockTestSuites)
    setIsRunning(false)
  }

  const refreshData = async () => {
    console.log('🔄 Refresh button clicked!')
    setIsRefreshing(true)
    console.log('🔄 TestSprite data refreshing...')
    
    // Simulate a brief refresh delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Reset to initial state and update last run time
    setTestSuites([...mockTestSuites]) // Create new array reference
    setLastRun(new Date())
    setIsRunning(false)
    setIsRefreshing(false)
    console.log('✅ TestSprite data refreshed')
  }

  const getTotalStats = () => {
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0)
    const passedTests = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0)
    const failedTests = testSuites.reduce((sum, suite) => sum + suite.failedTests, 0)
    const totalDuration = testSuites.reduce((sum, suite) => sum + suite.duration, 0)
    
    return { totalTests, passedTests, failedTests, totalDuration }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'running': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      adaptive: 'bg-blue-100 text-blue-800',
      session: 'bg-green-100 text-green-800',
      validation: 'bg-purple-100 text-purple-800',
      performance: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const stats = getTotalStats()
  const passRate = stats.totalTests > 0 ? (stats.passedTests / stats.totalTests) * 100 : 0

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <TestTube className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              TestSprite Testing Dashboard
            </h2>
            <p className="text-muted-foreground">
              Comprehensive test coverage for adaptive tutoring system
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
          <Button onClick={refreshData} variant="outline" size="sm" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">Across {testSuites.length} test suites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passedTests}</div>
            <p className="text-xs text-muted-foreground">
              {passRate.toFixed(1)}% pass rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedTests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.failedTests === 0 ? 'All tests passing!' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDuration}ms</div>
            <p className="text-xs text-muted-foreground">
              Last run: {lastRun ? lastRun.toLocaleTimeString() : 'Never'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pass Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Test Coverage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Pass Rate</span>
              <span className="text-sm text-muted-foreground">{passRate.toFixed(1)}%</span>
            </div>
            <Progress value={passRate} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map((suite, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  {suite.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{suite.totalTests} tests</Badge>
                  <Badge className="bg-green-100 text-green-800">{suite.passedTests} passed</Badge>
                  {suite.failedTests > 0 && (
                    <Badge className="bg-red-100 text-red-800">{suite.failedTests} failed</Badge>
                  )}
                  <Badge variant="secondary">{suite.duration}ms</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suite.tests.map((test, testIndex) => (
                  <div key={testIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <span className="text-sm font-medium">{test.name}</span>
                      <Badge className={getCategoryBadge(test.category)} variant="outline">
                        {test.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.duration && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {test.duration}ms
                        </span>
                      )}
                      <span className={`text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TestSprite Integration Benefits */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>TestSprite Integration Benefits:</strong> Automated testing ensures reliability of adaptive algorithms, 
          comprehensive edge case coverage, performance validation, and rapid feedback during development. 
          This enables confident deployment of educational technology that students can depend on.
        </AlertDescription>
      </Alert>
    </div>
  )
}
