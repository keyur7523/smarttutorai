"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Target, Zap, TrendingUp, Lightbulb, TestTube } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const handleStartLearning = () => {
    console.log('🚀 Start Learning button clicked')
    console.log('🧭 Navigating to /learn')
    router.push("/learn")
    console.log('🧭 Navigation initiated')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartTutor
            </h1>
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Master fractions with our intelligent tutoring system powered by TestSprite testing for reliable, fast learning experiences.
          </p>

          <Button onClick={handleStartLearning} size="lg" className="text-lg px-8 py-6">
            Start Learning
            <TrendingUp className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg">Adaptive Difficulty</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI automatically adjusts problem difficulty based on your performance, keeping you in the optimal
                learning zone.
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Easy
                </Badge>
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  Medium
                </Badge>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  Hard
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-lg">Smart Hints</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get contextual hints when you need them. Static hints provide quick guidance, while AI-generated hints
                offer personalized help.
              </p>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-blue-100 text-blue-800">Static Hints</Badge>
                <Badge className="bg-purple-100 text-purple-800">AI Hints</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TestTube className="h-6 w-6 text-green-600" />
                <CardTitle className="text-lg">TestSprite Testing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive automated testing ensures our adaptive algorithms work correctly for every student scenario.
              </p>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-green-100 text-green-800">26 Tests</Badge>
                <Badge className="bg-blue-100 text-blue-800">100% Coverage</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your learning progress with detailed analytics and performance insights.
              </p>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-orange-100 text-orange-800">Analytics</Badge>
                <Badge className="bg-green-100 text-green-800">Insights</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold">Start at Medium</h3>
                <p className="text-sm text-muted-foreground">Begin with medium-level fraction problems</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold">Adaptive Learning</h3>
                <p className="text-sm text-muted-foreground">Difficulty adjusts based on your performance</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold">Get Feedback</h3>
                <p className="text-sm text-muted-foreground">Receive personalized explanations and hints</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm text-muted-foreground">Monitor your improvement over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topics Covered */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Addition",
                "Subtraction",
                "Multiplication",
                "Division",
                "Simplification",
                "Comparison",
                "Conversion",
                "Mixed Numbers",
              ].map((topic) => (
                <div
                  key={topic}
                  className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center border border-blue-100"
                >
                  <span className="font-medium text-blue-800">{topic}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-6">Ready to master fractions?</p>
          <Button onClick={handleStartLearning} size="lg" className="text-lg px-8 py-6">
            Begin Your Journey
            <BookOpen className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
