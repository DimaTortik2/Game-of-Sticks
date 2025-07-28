import type { IStick } from '../interfaces/stick.interfaces'

export function makeSticksStartArr(allCount: number) {
	return Array.from(
		{ length: allCount },
		(_, i): IStick => ({
			isSelected: false,
			id: i,
			groupId: 0,
			isWrong: false,
		})
	)
}
