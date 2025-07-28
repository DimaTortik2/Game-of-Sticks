import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type { ISliderState } from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'
import { Clue } from '../../../shared/ui/alerts/clue'
import { PlayButton } from '../ui/play-button'
import { setGameParamsToCookies } from '../../../app/stores/game/cookies/game-params/set-game-params-to-cookies'
import { randomize } from '../model/helpers/randomize'
import { makeSticksStartArr } from '../../../entities/sticks'
import { useSetAtom } from 'jotai'
import { sticksArrCookieAtom } from '../../../app/stores/game/game-store'

export function PressetingFormMode3() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [maxPerStepStreak, setMaxPerStepStreak] = useState<ISliderState>(1)
	const setSticksArr = useSetAtom(sticksArrCookieAtom)

	useEffect(() => {
		if (maxPerStepStreak > allCount) setMaxPerStepStreak(allCount)
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
				onRandomClick={() =>
					setMaxPerStepStreak(randomize({ from: 5, to: allCount }))
				}
			/>
			<Clue />

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
