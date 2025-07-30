export interface IGameParams {
	helpsCount: number
	isEnemyStep: boolean
	sticksCount: number
	maxPerStep?: number
	maxPerStepStreak?: number
	sticksRange?: number[]
	sticksRangeStreak?: number[]
	isFirstComputerStep: boolean
}
