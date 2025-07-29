import { myStep } from '../features/game/field/model/helpers/my-step'

export function TestPage() {
	console.log(
		myStep([
			{ isSelected: true, groupId: 0, id: 5 },
			{ isSelected: true, groupId: 0, id: 5 },
			{ isSelected: true, groupId: 0, id: 5 },
			{ isSelected: true, groupId: 0, id: 5 },
			{ isSelected: false, groupId: 0, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
			{ isSelected: false, groupId: 5, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
			{ isSelected: true, groupId: 5, id: 5 },
		])
	)
	return <p className='bg-custom-dark'>{}</p>
}
