import { useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type { ISliderState } from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'
import { Clue } from '../../../shared/ui/alerts/clue'
import { PlayButton } from '../ui/play-button'
import { randomize } from '../model/helpers/randomize'
import { makeSticksStartArr } from '../../../entities/sticks'
import { useSetAtom } from 'jotai'
import {
	gameParamsCookieAtom,
	sticksArrCookieAtom,
} from '../../../app/stores/game/game-store'

export function PressetingFormMode5() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const setSticksArr = useSetAtom(sticksArrCookieAtom)
	const setGameParams = useSetAtom(gameParamsCookieAtom)

	const handlePlayClick = () => {
		setGameParams({
			sticksCount: allCount,
			maxPerStep: undefined,
			maxPerStepStreak: undefined,
			sticksRange: undefined,
			sticksRangeStreak: undefined,
		})

		setSticksArr(makeSticksStartArr(allCount))
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
			<Clue />

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
