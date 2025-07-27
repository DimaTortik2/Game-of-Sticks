export function pluralizeSticks(count: number): string {
	const num = Math.abs(count) % 100
	const remainder = num % 10

	if (num > 10 && num < 20) {
		return 'палочек'
	}
	if (remainder > 1 && remainder < 5) {
		return 'палочки'
	}
	if (remainder === 1) {
		return 'палочка'
	}
	return 'палочек'
}
