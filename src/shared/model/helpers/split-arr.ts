export function splitArrayBySum(numbers: number[], maxSum: number = 25) {
	const totalSum = numbers.reduce((sum, num) => sum + num, 0)
	if (totalSum <= maxSum) {
		return [numbers, []]
	}

	const part1 = []
	const part2 = []
	let currentSum = 0
	let isSplitPointFound = false

	for (let i = 0; i < numbers.length; i++) {
		const currentNumber = numbers[i]

		if (isSplitPointFound) {
			part2.push(currentNumber)
			continue
		}

		if (currentSum + currentNumber <= maxSum) {
			part1.push(currentNumber)
			currentSum += currentNumber
		} else {
			isSplitPointFound = true

			const neededForPart1 = maxSum - currentSum

			if (neededForPart1 > 0) {
				part1.push(neededForPart1)
			}

			const remainderForPart2 = currentNumber - neededForPart1
			part2.push(remainderForPart2)
		}
	}

	return [part1, part2]
}
