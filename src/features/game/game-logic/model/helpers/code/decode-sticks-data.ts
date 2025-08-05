import type { IStick } from '../../../../../../entities/sticks/model/interfaces/stick.interfaces'

export function decodeSticksData(codedData: number[]): IStick[] {
	const sticks: IStick[] = []
	let id = 0

	codedData.forEach((count, groupId) => {
		for (let i = 0; i < count; i++) {
			sticks.push({
				id,
				groupId,
				isSelected: false,
			})
			id++
		}
	})

	return sticks
}
