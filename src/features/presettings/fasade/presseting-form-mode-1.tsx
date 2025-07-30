import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type { ISliderState } from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'
import { PlayButton } from '../ui/play-button'
import { Clue } from '../../../shared/ui/alerts/clue'
import { randomize } from '../model/helpers/randomize'
import { makeSticksStartArr } from '../../../entities/sticks'
import { useSetAtom } from 'jotai'
import {
	gameParamsCookieAtom,
	sticksArrCookieAtom,
} from '../../../app/stores/game/game-store'
import { PresettingPushBtn } from '../ui/presseting-push-btn'

export function PressetingFormMode1() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [maxPerStep, setMaxPerStep] = useState<ISliderState>(1)
	const setSticksArr = useSetAtom(sticksArrCookieAtom)
	const setGameParams = useSetAtom(gameParamsCookieAtom)
	const [isFirstComputerStep, setIsFirstComputerStep] = useState(false)

	useEffect(() => {
		if (maxPerStep > allCount) setMaxPerStep(allCount)
	}, [allCount])
	// to fix a bug between two sliders

	const handlePlayClick = () => {
		setGameParams({
			sticksCount: allCount,
			maxPerStep,
			maxPerStepStreak: undefined,
			sticksRange: undefined,
			sticksRangeStreak: undefined,
			isFirstComputerStep,
		})
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
			<PresettingPushBtn
				title='Сначала ходит компьютер'
				onClick={() => {
					setIsFirstComputerStep(prev => !prev)
				}}
				isActive={isFirstComputerStep}
			/>
			<Clue />

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
