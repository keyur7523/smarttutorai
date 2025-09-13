/**
 * TestSprite Integration - Session Management Tests
 * 
 * Comprehensive testing of session state management and problem selection
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { pickNext } from '../lib/itemBank'
import { Level, Problem } from '../store/types'

describe('Session Management - TestSprite Integration', () => {
  const mockProblems: Problem[] = [
    {
      id: 'e1',
      stem: 'What is 1/2 + 1/4?',
      type: 'mcq',
      choices: ['1/6', '2/6', '3/4', '2/4'],
      answer_key: ['3/4'],
      level: 'easy',
      topic: 'addition',
      hints: ['Find common denominator', 'Add numerators']
    },
    {
      id: 'm1',
      stem: 'Simplify 6/8',
      type: 'short',
      answer_key: ['3/4'],
      level: 'medium',
      topic: 'simplification',
      hints: ['Find GCD', 'Divide both terms']
    },
    {
      id: 'h1',
      stem: 'Solve: (2/3) ÷ (1/4)',
      type: 'short',
      answer_key: ['8/3', '2 2/3'],
      level: 'hard',
      topic: 'division',
      hints: ['Flip second fraction', 'Multiply', 'Simplify']
    }
  ]

  describe('pickNext function', () => {
    it('should select appropriate level problems', () => {
      const easyProblem = pickNext('easy', [], mockProblems)
      const mediumProblem = pickNext('medium', [], mockProblems)
      const hardProblem = pickNext('hard', [], mockProblems)
      
      expect(easyProblem?.level).toBe('easy')
      expect(mediumProblem?.level).toBe('medium')
      expect(hardProblem?.level).toBe('hard')
    })

    it('should avoid recently used problems', () => {
      const recentIds = ['e1']
      const problem = pickNext('easy', recentIds, mockProblems)
      
      expect(problem?.id).not.toBe('e1')
    })

    it('should return null when no problems available', () => {
      const problem = pickNext('easy', ['e1'], [mockProblems[0]])
      expect(problem).toBeNull()
    })

    it('should handle empty problems array', () => {
      const problem = pickNext('easy', [], [])
      expect(problem).toBeNull()
    })
  })

  describe('Problem Selection Edge Cases', () => {
    it('should handle all problems being recent', () => {
      const allRecentIds = mockProblems.map(p => p.id)
      const problem = pickNext('medium', allRecentIds, mockProblems)
      expect(problem).toBeNull()
    })

    it('should select from available problems when some are recent', () => {
      const recentIds = ['e1']
      const availableProblems = mockProblems.filter(p => p.level === 'easy')
      const problem = pickNext('easy', recentIds, availableProblems)
      
      expect(problem).toBeDefined()
      expect(problem?.id).not.toBe('e1')
    })
  })

  describe('Performance Testing', () => {
    it('should handle large problem sets efficiently', () => {
      const largeProblemSet: Problem[] = Array.from({ length: 10000 }, (_, i) => ({
        id: `p${i}`,
        stem: `Problem ${i}`,
        type: 'mcq' as const,
        choices: ['A', 'B', 'C', 'D'],
        answer_key: ['A'],
        level: ['easy', 'medium', 'hard'][i % 3] as Level,
        topic: 'test',
        hints: ['Hint 1', 'Hint 2']
      }))
      
      const startTime = performance.now()
      const problem = pickNext('medium', [], largeProblemSet)
      const endTime = performance.now()
      
      expect(problem).toBeDefined()
      expect(endTime - startTime).toBeLessThan(50) // Should complete in less than 50ms
    })
  })
})
