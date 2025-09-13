"use client"

import { TestSpriteDashboard } from '@/components/TestSpriteDashboard'

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <TestSpriteDashboard />
      </div>
    </div>
  )
}
