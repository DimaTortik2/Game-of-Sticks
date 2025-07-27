import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type {
	ISliderRangeState,
	ISliderState,
} from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'
import { Clue } from '../../../shared/ui/alerts/clue'
import { PlayButton } from '../ui/play-button'
import { setGameParamsToCookies } from '../../../pages/game-page/helpers/set-game-params-to-cookies'

export function PressetingFormMode2() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [Range, setRange] = useState<ISliderRangeState>([1, 50])

	useEffect(() => {
		if (Range[1] > allCount) setRange(prev => [prev[0], allCount])
	}, [allCount])
	// to fix a bug between two sliders
	
	const handlePlayClick = () => {
		setGameParamsToCookies({ sticksCount: allCount })
	}

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
				min={1}
				max={allCount}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderRangeState: setRange,
						})}
						value={Range}
						min={1}
						max={allCount}
						step={1}
					/>
				}
				leftCount={Range[0]}
				rightCount={Range[1]}
			/>
			<Clue />

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
