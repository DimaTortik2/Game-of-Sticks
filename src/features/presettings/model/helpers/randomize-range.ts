export function randomizeRange({ from, to }: { from: number; to: number }) {
	const min = Math.ceil(from)
	const max = Math.floor(to)

	const leftRand = Math.floor(Math.random() * (max - min + 1)) + min

	let rightRand
	do {
		rightRand = Math.floor(Math.random() * (max - min + 1)) + min
	} while (min !== max && rightRand === leftRand)

	if (leftRand < rightRand) return [leftRand, rightRand]
	else return [rightRand, leftRand]
}
