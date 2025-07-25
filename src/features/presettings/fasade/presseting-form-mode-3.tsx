import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type { ISliderState } from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'
import { Clue } from '../../../shared/ui/alerts/alert'
import { PlayButton } from '../ui/play-button'

export function PressetingFormMode3() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [maxPerStepStreak, setMaxPerStepStreak] = useState<ISliderState>(1)

	useEffect(() => {
		if (maxPerStepStreak > allCount) setMaxPerStepStreak(allCount)
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
				isStreak={true}
				title='Максимум палочек за ход'
				min={1}
				max={allCount}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderState: setMaxPerStepStreak,
						})}
						value={maxPerStepStreak}
						min={1}
						max={allCount}
						step={1}
					/>
				}
				rightCount={maxPerStepStreak}
			/>
			<Clue/>
			
						<PlayButton onClick={() => {}} />
		</div>
	)
}
