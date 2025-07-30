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
import { PresettingPushBtn } from '../ui/presseting-push-btn'

export function PressetingFormMode5() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [helpsCount, setHelpsCount] = useState<ISliderState>(1)

	const setSticksArr = useSetAtom(sticksArrCookieAtom)
	const setGameParams = useSetAtom(gameParamsCookieAtom)
	const [isFirstComputerStep, setIsFirstComputerStep] = useState(false)

	const handlePlayClick = () => {
		setGameParams({
			sticksCount: allCount,
			maxPerStep: undefined,
			maxPerStepStreak: undefined,
			sticksRange: undefined,
			sticksRangeStreak: undefined,
			isFirstComputerStep,
			helpsCount,
			isEnemyStep: isFirstComputerStep,
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
			<PresettingItem
				title='Количество подсказок'
				min={0}
				max={5}
				slider={
					<PresettingSlider
						onChange={makeHandleSliderChange({
							setSliderState: setHelpsCount,
						})}
						value={helpsCount}
						min={0}
						max={5}
						step={1}
					/>
				}
				rightCount={helpsCount}
				onRandomClick={() => setHelpsCount(randomize({ from: 0, to: 5 }))}
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
