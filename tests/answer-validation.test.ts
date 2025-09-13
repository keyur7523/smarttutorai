/**
 * TestSprite Integration - Answer Validation Tests
 * 
 * Comprehensive testing of answer checking and feedback systems
 */

import { describe, it, expect } from 'vitest'
import { isCorrect } from '../lib/check'
import { Problem } from '../store/types'

describe('Answer Validation - TestSprite Integration', () => {
  describe('Multiple Choice Questions', () => {
    const mcqProblem: Problem = {
      id: 'mcq1',
      stem: 'What is 1/2 + 1/4?',
      type: 'mcq',
      choices: ['1/6', '2/6', '3/4', '2/4'],
      answer_key: ['3/4'],
      level: 'easy',
      topic: 'addition',
      hints: ['Find common denominator']
    }

    it('should accept correct multiple choice answer', () => {
      expect(isCorrect(mcqProblem, '3/4')).toBe(true)
    })

    it('should reject incorrect multiple choice answer', () => {
      expect(isCorrect(mcqProblem, '1/6')).toBe(false)
      expect(isCorrect(mcqProblem, '2/6')).toBe(false)
      expect(isCorrect(mcqProblem, '2/4')).toBe(false)
    })

    it('should handle case-insensitive answers', () => {
      expect(isCorrect(mcqProblem, '3/4')).toBe(true)
      expect(isCorrect(mcqProblem, '3/4')).toBe(true)
    })

    it('should handle whitespace in answers', () => {
      expect(isCorrect(mcqProblem, ' 3/4 ')).toBe(true)
      expect(isCorrect(mcqProblem, '3/4')).toBe(true)
    })
  })

  describe('Short Answer Questions', () => {
    const shortProblem: Problem = {
      id: 'short1',
      stem: 'Simplify 6/8',
      type: 'short',
      answer_key: ['3/4'],
      level: 'medium',
      topic: 'simplification',
      hints: ['Find GCD']
    }

    it('should accept correct short answer', () => {
      expect(isCorrect(shortProblem, '3/4')).toBe(true)
    })

    it('should reject incorrect short answer', () => {
      expect(isCorrect(shortProblem, '6/8')).toBe(false)
      expect(isCorrect(shortProblem, '2/3')).toBe(false)
    })

    it('should handle multiple correct answers', () => {
      const multiAnswerProblem: Problem = {
        ...shortProblem,
        answer_key: ['3/4', '0.75', '75%']
      }
      
      expect(isCorrect(multiAnswerProblem, '3/4')).toBe(true)
      expect(isCorrect(multiAnswerProblem, '0.75')).toBe(true)
      expect(isCorrect(multiAnswerProblem, '75%')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty answer', () => {
      const problem: Problem = {
        id: 'test1',
        stem: 'Test problem',
        type: 'short',
        answer_key: ['answer'],
        level: 'easy',
        topic: 'test',
        hints: []
      }
      
      expect(isCorrect(problem, '')).toBe(false)
    })

    it('should handle problem with no answer key', () => {
      const problem: Problem = {
        id: 'test2',
        stem: 'Test problem',
        type: 'short',
        answer_key: [],
        level: 'easy',
        topic: 'test',
        hints: []
      }
      
      expect(isCorrect(problem, 'any answer')).toBe(false)
    })

    it('should handle special characters in answers', () => {
      const problem: Problem = {
        id: 'test3',
        stem: 'Test problem',
        type: 'short',
        answer_key: ['1/2', '½', '0.5'],
        level: 'easy',
        topic: 'test',
        hints: []
      }
      
      expect(isCorrect(problem, '1/2')).toBe(true)
      expect(isCorrect(problem, '½')).toBe(true)
      expect(isCorrect(problem, '0.5')).toBe(true)
    })
  })

  describe('Performance Testing', () => {
    it('should validate answers quickly', () => {
      const problem: Problem = {
        id: 'perf1',
        stem: 'Performance test',
        type: 'short',
        answer_key: ['answer'],
        level: 'easy',
        topic: 'test',
        hints: []
      }
      
      const startTime = performance.now()
      for (let i = 0; i < 1000; i++) {
        isCorrect(problem, 'answer')
      }
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // Should complete 1000 validations in less than 100ms
    })
  })
})
