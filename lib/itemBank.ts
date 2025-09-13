import { Problem, Level } from '@/store/types'

/**
 * Problem selection logic with exact specifications:
 * - Always select from current level (100% current level, no review/probe)
 * - Filter out recent problem IDs (last 5)
 * - Random selection from available problems
 * - Return null if no problems available
 * - Add debug logging for troubleshooting
 */
export function pickNext(level: Level, recentIds: string[], problems: Problem[]): Problem | null {
  console.log('🔍 Problem selection started:', { level, recentIds, totalProblems: problems.length })
  
  // Filter problems by current level (100% current level, no review/probe)
  const levelProblems = problems.filter(p => p.level === level)
  console.log(`📊 Found ${levelProblems.length} problems for level: ${level}`)
  
  // Filter out recent problem IDs (last 5)
  const availableProblems = levelProblems.filter(p => !recentIds.includes(p.id))
  console.log(`✅ Available problems after filtering recent IDs: ${availableProblems.length}`)
  
  if (availableProblems.length === 0) {
    console.log('❌ No available problems found')
    return null
  }
  
  // Random selection from available problems
  const randomIndex = Math.floor(Math.random() * availableProblems.length)
  const selectedProblem = availableProblems[randomIndex]
  
  console.log('🎯 Selected problem:', {
    id: selectedProblem.id,
    level: selectedProblem.level,
    topic: selectedProblem.topic,
    type: selectedProblem.type
  })
  
  return selectedProblem
}

/**
 * ItemBank class for managing problem selection
 */
export class ItemBank {
  private problems: Problem[] = []
  
  constructor(problems: Problem[]) {
    this.problems = problems
    console.log('📚 ItemBank initialized with', problems.length, 'problems')
  }
  
  /**
   * Pick next problem based on level and recent IDs
   */
  pickNext(level: Level, recentIds: string[]): Problem | null {
    return pickNext(level, recentIds, this.problems)
  }
  
  /**
   * Get all problems for a specific level
   */
  getProblemsByLevel(level: Level): Problem[] {
    return this.problems.filter(p => p.level === level)
  }
  
  /**
   * Get problem by ID
   */
  getProblemById(id: string): Problem | undefined {
    return this.problems.find(p => p.id === id)
  }
  
  /**
   * Get total problem count
   */
  getTotalCount(): number {
    return this.problems.length
  }
  
  /**
   * Get problem count by level
   */
  getCountByLevel(level: Level): number {
    return this.problems.filter(p => p.level === level).length
  }
}