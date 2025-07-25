import { useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type { ISliderState } from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'

export function PressetingFormMode5() {
	const [allCount, setAllCount] = useState<ISliderState>(5)

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
		</div>
	)
}
