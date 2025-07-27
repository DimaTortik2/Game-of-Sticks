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
import { randomize } from '../model/helpers/randomize'
import { randomizeRange } from '../model/helpers/randomize-range'
import { setSticksOnFieldToCookies } from '../../../app/helpers/sticks-on-field/set-sticks-on-field-to-cookies'
import { makeArray } from '../model/helpers/make-array'

export function PressetingFormMode4() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [RangeStreak, setRangeStreak] = useState<ISliderRangeState>([1, 50])

	useEffect(() => {
		if (RangeStreak[1] > allCount) setRangeStreak(prev => [prev[0], allCount])
	}, [allCount])
	// to fix a bug between two sliders

	const handlePlayClick = () => {
		setGameParamsToCookies({ sticksCount: allCount })
				setSticksOnFieldToCookies([makeArray(allCount)])
		
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
				onRandomClick={() => setAllCount(randomize({ from: 5, to: 50 }))}
			/>

			<PresettingItem
				title='Диапазон выбора палочек за ход'
				isStreak={true}
				min={1}
				max={allCount}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderRangeState: setRangeStreak,
						})}
						value={RangeStreak}
						min={1}
						max={allCount}
						step={1}
					/>
				}
				leftCount={RangeStreak[0]}
				rightCount={RangeStreak[1]}
				onRandomClick={() =>
					setRangeStreak(randomizeRange({ from: 1, to: allCount }))
				}
			/>
			<Clue />

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
