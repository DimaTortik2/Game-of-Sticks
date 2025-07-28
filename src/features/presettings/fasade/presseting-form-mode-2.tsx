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
import { setGameParamsToCookies } from '../../../app/stores/game/cookies/game-params/set-game-params-to-cookies'
import { randomize } from '../model/helpers/randomize'
import { randomizeRange } from '../model/helpers/randomize-range'
import { makeSticksStartArr } from '../../../entities/sticks'
import { useSetAtom } from 'jotai'
import { sticksArrCookieAtom } from '../../../app/stores/game/game-store'

export function PressetingFormMode2() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [Range, setRange] = useState<ISliderRangeState>([1, 50])
	const setSticksArr = useSetAtom(sticksArrCookieAtom)

	useEffect(() => {
		if (Range[1] > allCount) setRange(prev => [prev[0], allCount])
	}, [allCount])
	// to fix a bug between two sliders

	const handlePlayClick = () => {
		setGameParamsToCookies({ sticksCount: allCount })
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
				onRandomClick={() =>
					setRange(randomizeRange({ from: 1, to: allCount }))
				}
			/>
			<Clue />

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
