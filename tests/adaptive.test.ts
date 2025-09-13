/**
 * TestSprite Integration - Adaptive Learning Algorithm Tests
 * 
 * This test suite demonstrates how TestSprite enables comprehensive testing
 * of our adaptive tutoring system's core algorithms.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { getNextLevel } from '../lib/adapt'
import { Level, HistoryItem } from '../store/types'

describe('Adaptive Learning Algorithm - TestSprite Integration', () => {
  describe('getNextLevel', () => {
    it('should start at medium level and progress to hard after 2 consecutive correct', () => {
      const history: HistoryItem[] = [
        { problemId: 'm1', levelAtTime: 'medium', correct: true, timeMs: 5000, usedHint: false, submittedAt: Date.now() - 1000 },
        { problemId: 'm2', levelAtTime: 'medium', correct: true, timeMs: 4500, usedHint: false, submittedAt: Date.now() - 500 }
      ]
      
      const result = getNextLevel('medium', history)
      expect(result).toBe('hard')
    })

    it('should demote from hard to medium after 2 consecutive wrong', () => {
      const history: HistoryItem[] = [
        { problemId: 'h1', levelAtTime: 'hard', correct: false, timeMs: 8000, usedHint: true, submittedAt: Date.now() - 1000 },
        { problemId: 'h2', levelAtTime: 'hard', correct: false, timeMs: 9000, usedHint: true, submittedAt: Date.now() - 500 }
      ]
      
      const result = getNextLevel('hard', history)
      expect(result).toBe('medium')
    })

    it('should demote from hard to medium after 3 total wrong answers', () => {
      const history: HistoryItem[] = [
        { problemId: 'h1', levelAtTime: 'hard', correct: true, timeMs: 5000, usedHint: false, submittedAt: Date.now() - 3000 },
        { problemId: 'h2', levelAtTime: 'hard', correct: false, timeMs: 8000, usedHint: true, submittedAt: Date.now() - 2000 },
        { problemId: 'h3', levelAtTime: 'hard', correct: true, timeMs: 6000, usedHint: false, submittedAt: Date.now() - 1000 },
        { problemId: 'h4', levelAtTime: 'hard', correct: false, timeMs: 9000, usedHint: true, submittedAt: Date.now() - 800 },
        { problemId: 'h5', levelAtTime: 'hard', correct: false, timeMs: 8500, usedHint: true, submittedAt: Date.now() - 400 }
      ]
      
      const result = getNextLevel('hard', history)
      expect(result).toBe('medium')
    })

    it('should promote from easy to medium after 2 consecutive correct', () => {
      const history: HistoryItem[] = [
        { problemId: 'e1', levelAtTime: 'easy', correct: true, timeMs: 3000, usedHint: false, submittedAt: Date.now() - 1000 },
        { problemId: 'e2', levelAtTime: 'easy', correct: true, timeMs: 2500, usedHint: false, submittedAt: Date.now() - 500 }
      ]
      
      const result = getNextLevel('easy', history)
      expect(result).toBe('medium')
    })

    it('should demote from medium to easy after 2 consecutive wrong', () => {
      const history: HistoryItem[] = [
        { problemId: 'm1', levelAtTime: 'medium', correct: false, timeMs: 6000, usedHint: true, submittedAt: Date.now() - 1000 },
        { problemId: 'm2', levelAtTime: 'medium', correct: false, timeMs: 7000, usedHint: true, submittedAt: Date.now() - 500 }
      ]
      
      const result = getNextLevel('medium', history)
      expect(result).toBe('easy')
    })

    it('should maintain current level when conditions not met', () => {
      const history: HistoryItem[] = [
        { problemId: 'm1', levelAtTime: 'medium', correct: true, timeMs: 5000, usedHint: false, submittedAt: Date.now() - 1000 },
        { problemId: 'm2', levelAtTime: 'medium', correct: false, timeMs: 6000, usedHint: true, submittedAt: Date.now() - 500 }
      ]
      
      const result = getNextLevel('medium', history)
      expect(result).toBe('medium')
    })
  })

  describe('Edge Cases - TestSprite Validation', () => {
    it('should handle empty history gracefully', () => {
      const result = getNextLevel('medium', [])
      expect(result).toBe('medium')
    })

    it('should handle single answer correctly', () => {
      const history: HistoryItem[] = [
        { problemId: 'm1', levelAtTime: 'medium', correct: true, timeMs: 5000, usedHint: false, submittedAt: Date.now() }
      ]
      
      const result = getNextLevel('medium', history)
      expect(result).toBe('medium')
    })

    it('should handle mixed performance patterns', () => {
      const history: HistoryItem[] = [
        { problemId: 'm1', levelAtTime: 'medium', correct: true, timeMs: 5000, usedHint: false, submittedAt: Date.now() - 5000 },
        { problemId: 'm2', levelAtTime: 'medium', correct: false, timeMs: 6000, usedHint: true, submittedAt: Date.now() - 4000 },
        { problemId: 'm3', levelAtTime: 'medium', correct: true, timeMs: 4500, usedHint: false, submittedAt: Date.now() - 3000 },
        { problemId: 'm4', levelAtTime: 'medium', correct: false, timeMs: 7000, usedHint: true, submittedAt: Date.now() - 2000 },
        { problemId: 'm5', levelAtTime: 'medium', correct: true, timeMs: 4000, usedHint: false, submittedAt: Date.now() - 1000 }
      ]
      
      const result = getNextLevel('medium', history)
      expect(result).toBe('medium')
    })
  })

  describe('Performance Testing - TestSprite Integration', () => {
    it('should handle large history efficiently', () => {
      const largeHistory: HistoryItem[] = Array.from({ length: 1000 }, (_, i) => ({
        problemId: `m${i}`,
        levelAtTime: 'medium' as Level,
        correct: Math.random() > 0.5,
        timeMs: Math.floor(Math.random() * 10000) + 1000,
        usedHint: Math.random() > 0.7,
        submittedAt: Date.now() - (1000 - i) * 1000
      }))
      
      const startTime = performance.now()
      const result = getNextLevel('medium', largeHistory)
      const endTime = performance.now()
      
      expect(result).toBeDefined()
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
    })
  })
})
