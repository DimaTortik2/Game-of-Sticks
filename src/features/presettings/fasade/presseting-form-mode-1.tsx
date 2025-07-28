import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type { ISliderState } from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'
import { PlayButton } from '../ui/play-button'
import { Clue } from '../../../shared/ui/alerts/clue'
import { setGameParamsToCookies } from '../../../app/stores/game/cookies/game-params/set-game-params-to-cookies'
import { randomize } from '../model/helpers/randomize'
import { makeSticksStartArr } from '../../../entities/sticks'
import { useSetAtom } from 'jotai'
import { sticksArrCookieAtom } from '../../../app/stores/game/game-store'

export function PressetingFormMode1() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [maxPerStep, setMaxPerStep] = useState<ISliderState>(1)
	const setSticksArr = useSetAtom(sticksArrCookieAtom)

	useEffect(() => {
		if (maxPerStep > allCount) setMaxPerStep(allCount)
	}, [allCount])
	// to fix a bug between two sliders

	const handlePlayClick = () => {
		setGameParamsToCookies({ sticksCount: allCount })
		console.log({ arr: makeSticksStartArr(allCount) })
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
				title='Максимум палочек за ход'
				min={1}
				max={allCount}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderState: setMaxPerStep,
						})}
						value={maxPerStep}
						min={1}
						max={allCount}
						step={1}
					/>
				}
				rightCount={maxPerStep}
				onRandomClick={() =>
					setMaxPerStep(randomize({ from: 1, to: allCount }))
				}
			/>
			<Clue />

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
