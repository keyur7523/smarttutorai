"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useSessionStore } from "@/store/session"

interface PerformanceChartProps {
  type?: "accuracy" | "speed" | "level"
}

export function PerformanceChart({ type = "accuracy" }: PerformanceChartProps) {
  const { history } = useSessionStore()

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">No data available yet</div>
        </CardContent>
      </Card>
    )
  }

  const prepareAccuracyData = () => {
    const data = []
    let correctCount = 0

    history.forEach((item, index) => {
      if (item.correct) correctCount++
      const accuracy = (correctCount / (index + 1)) * 100

      data.push({
        problem: index + 1,
        accuracy: Math.round(accuracy),
        correct: item.correct ? 1 : 0,
      })
    })

    return data
  }

  const prepareSpeedData = () => {
    return history.map((item, index) => ({
      problem: index + 1,
      time: Math.round(item.timeSpent / 1000), // Convert to seconds
      level: item.level,
    }))
  }

  const prepareLevelData = () => {
    const levelCounts = { easy: 0, medium: 0, hard: 0 }
    const levelCorrect = { easy: 0, medium: 0, hard: 0 }

    history.forEach((item) => {
      levelCounts[item.level]++
      if (item.correct) levelCorrect[item.level]++
    })

    return [
      {
        level: "Easy",
        accuracy: levelCounts.easy > 0 ? Math.round((levelCorrect.easy / levelCounts.easy) * 100) : 0,
        count: levelCounts.easy,
      },
      {
        level: "Medium",
        accuracy: levelCounts.medium > 0 ? Math.round((levelCorrect.medium / levelCounts.medium) * 100) : 0,
        count: levelCounts.medium,
      },
      {
        level: "Hard",
        accuracy: levelCounts.hard > 0 ? Math.round((levelCorrect.hard / levelCounts.hard) * 100) : 0,
        count: levelCounts.hard,
      },
    ]
  }

  const renderChart = () => {
    switch (type) {
      case "accuracy":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={prepareAccuracyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="problem" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, "Accuracy"]}
                labelFormatter={(label) => `Problem ${label}`}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case "speed":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={prepareSpeedData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="problem" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`${value}s`, "Time"]}
                labelFormatter={(label) => `Problem ${label}`}
              />
              <Bar dataKey="time" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "level":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={prepareLevelData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value, name) => [`${value}%`, "Accuracy"]} />
              <Bar dataKey="accuracy" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  const getTitle = () => {
    switch (type) {
      case "accuracy":
        return "Accuracy Trend"
      case "speed":
        return "Response Time"
      case "level":
        return "Level Performance"
      default:
        return "Performance"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}
