import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type {
	ISliderRangeState,
	ISliderState,
} from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'

export function PressetingFormMode2() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [Range, setRange] = useState<ISliderRangeState>([
		5, 50,
	])

	useEffect(() => {
		if (Range[1] > allCount)
			setRange(prev => [prev[0], allCount])
	}, [allCount])
	// to fix a bug between two sliders

	return (
		<div className='flex flex-col gap-10'>
			<PresettingItem
				title='Общее количество палочек в игре'
				min={5}
				max={50}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderState: setAllCount,
						})}
						value={allCount}
						min={5}
						max={50}
						step={1}
					/>
				}
				rightCount={allCount}
			/>

			<PresettingItem
				title='Диапазон выбора палочек за ход'
				min={5}
				max={allCount}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderRangeState: setRange,
						})}
						value={Range}
						min={5}
						max={allCount}
						step={1}
					/>
				}
				leftCount={Range[0]}
				rightCount={Range[1]}
			/>
		</div>
	)
}
