"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Home, RotateCcw, BookOpen, TestTube, BarChart3 } from "lucide-react"
import { useSessionStore } from "@/store/session"

export function Navigation() {
  const router = useRouter()
  const { clearSession } = useSessionStore()

  const handleNewSession = () => {
    console.log('🔄 New Session button clicked')
    console.log('🧹 Calling clearSession()')
    clearSession()
    console.log('🧹 clearSession() completed')
    console.log('🧭 Navigating to /learn')
    router.push("/learn")
    console.log('🧭 Navigation initiated')
  }

  const handleHome = () => {
    clearSession()
    router.push("/")
  }

  return (
    <TooltipProvider>
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <BookOpen className="h-6 w-6" />
              SmartTutor
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Learn
                </Button>
              </Link>
              <Link href="/summary">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Summary
                </Button>
              </Link>
              <Link href="/testing">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  TestSprite
                </Button>
              </Link>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewSession}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4" />
                    New Session
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This will kill your current session</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  )
}
