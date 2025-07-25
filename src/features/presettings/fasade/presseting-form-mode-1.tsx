import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type { ISliderState } from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'

export function PressetingFormMode1() {
	const [allCountSlider, setAllCountSlider] = useState<ISliderState>(5)
	const [maxPerStepSlider, setMaxPerStepSlider] = useState<ISliderState>(5)
	// const [sliderRangeState, setSliderRangeState] = useState<ISliderRangeState>([
	// 	5, 50,
	// ])

	useEffect(() => {
		if (maxPerStepSlider > allCountSlider) setMaxPerStepSlider(allCountSlider)
	}, [allCountSlider])
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
							setSliderState: setAllCountSlider,
						})}
						value={allCountSlider}
						min={5}
						max={50}
						step={1}
					/>
				}
				rightCount={allCountSlider}
			/>

			<PresettingItem
				title='Максимум палочек за ход'
				min={5}
				max={allCountSlider}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderState: setMaxPerStepSlider,
						})}
						value={maxPerStepSlider}
						min={5}
						max={allCountSlider}
						step={1}
					/>
				}
				rightCount={maxPerStepSlider}
			/>

			{/* <PresettingItem
				min={5}
				max={50}
				slider={
					<PresettingSlider
						onChange={handleSliderChange}
						value={sliderRangeState}
						min={5}
						max={50}
						step={1}
					/>
				}
				leftCount={sliderRangeState[0]}
				rightCount={sliderRangeState[1]}
			/> */}
		</div>
	)
}
