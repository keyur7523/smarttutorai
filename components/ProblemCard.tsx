"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lightbulb, CheckCircle, XCircle } from "lucide-react"
import type { Problem } from "@/store/types"

interface ProblemCardProps {
  problem: Problem
  onSubmit: (answer: string) => void
  onHint: (hintIndex: number) => void
  feedback: { correct: boolean; explanation: string } | null
  isSubmitting: boolean
  disabled: boolean
  hints: string[]
  currentHintIndex: number
  dynamicHints: string[]
  isLoadingHint: boolean
}

export function ProblemCard({ 
  problem, 
  onSubmit, 
  onHint, 
  feedback, 
  isSubmitting, 
  disabled, 
  hints, 
  currentHintIndex, 
  dynamicHints, 
  isLoadingHint 
}: ProblemCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [shortAnswer, setShortAnswer] = useState<string>("")

  // Reset state when problem changes
  useEffect(() => {
    setSelectedAnswer("")
    setShortAnswer("")
  }, [problem.id])

  const handleSubmit = () => {
    if (isSubmitting || disabled) return

    const answer = problem.type === "mcq" ? selectedAnswer : shortAnswer
    if (!answer.trim()) return

    onSubmit(answer)
  }

  const handleHintClick = () => {
    if (disabled || isLoadingHint) return
    onHint(currentHintIndex)
  }

  const canSubmit = problem.type === "mcq" ? selectedAnswer : shortAnswer.trim()
  const canShowHint = currentHintIndex < 2 && !isSubmitting // Maximum 2 hints: 1 static + 1 LLM

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Problem</CardTitle>
          <Badge className={getLevelColor(problem.level)}>
            {problem.level.charAt(0).toUpperCase() + problem.level.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Problem Statement */}
        <div className="text-lg font-medium text-balance">{problem.stem}</div>

        {/* Answer Input */}
        {problem.type === "mcq" ? (
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={isSubmitting || disabled}
            className="space-y-3"
          >
            {problem.choices?.map((choice, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`choice-${index}`} />
                <Label htmlFor={`choice-${index}`} className="cursor-pointer">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="short-answer">Your Answer:</Label>
            <Input
              id="short-answer"
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              disabled={isSubmitting || disabled}
              placeholder="Enter your answer..."
              className="text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  handleSubmit()
                }
              }}
            />
          </div>
        )}

        {/* Hints Section */}
        {(currentHintIndex > 0) && (
          <div className="space-y-3">
            {/* First Hint: Static from JSON */}
            {currentHintIndex >= 1 && hints.length > 0 && (
              <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 mt-0.5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-800">Hint 1:</p>
                    <p className="text-sm text-purple-700">{hints[0]}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Second Hint: LLM Generated */}
            {currentHintIndex >= 2 && dynamicHints.length > 0 && (
              <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Hint 2 (AI Generated):</p>
                    <p className="text-sm text-blue-700">{dynamicHints[0]}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div
            className={`p-4 rounded-lg border ${
              feedback.correct 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-2">
              {feedback.correct ? (
                <CheckCircle className="h-5 w-5 mt-0.5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 mt-0.5 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${feedback.correct ? "text-green-800" : "text-red-800"}`}>
                  {feedback.correct ? "Correct!" : "Incorrect"}
                </p>
                <p className={`text-sm mt-1 ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
                  {feedback.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit || isSubmitting || disabled} 
            className="flex-1"
            aria-label="Submit your answer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Answer"
            )}
          </Button>

          {canShowHint && (
            <Button
              variant="outline"
              onClick={handleHintClick}
              disabled={isLoadingHint || disabled}
              className="flex items-center gap-2 bg-transparent"
              aria-label={`Get hint ${currentHintIndex + 1}`}
            >
              {isLoadingHint ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
              {currentHintIndex === 0 ? "Get Hint" : "Get AI Hint"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}