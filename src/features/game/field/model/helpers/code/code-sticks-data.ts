import { PREDEFINED_COLORS } from "../../../../../../app/consts/colors"
import type { IStick } from "../../../../../../entities/sticks/model/interfaces/stick.interfaces"

export function codeSticksData(data?: IStick[]): number[] {
	if (!data) return []

	const codedData: number[] = []

	PREDEFINED_COLORS.forEach((_, clrId) => {
		let count = 0
		data.forEach(el => {
			if (el.groupId === clrId) count++
		})

		if (count !== 0) {
			codedData.push(count)
		}
	})
	return codedData
}
