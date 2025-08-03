import { useEffect, useState } from 'react'
import { PresettingSlider } from '../ui/presetting-slider'
import { PresettingItem } from '../ui/presseting-item'
import type {
	ISliderRangeState,
	ISliderState,
} from '../model/interfaces/sliders.interface'
import { makeHandleSliderChange } from '../model/helpers/make-handle-slider-change'
import { PlayButton } from '../ui/play-button'
import { randomize } from '../model/helpers/randomize'
import { randomizeRange } from '../model/helpers/randomize-range'
import { makeSticksStartArr } from '../../../entities/sticks'
import { useSetAtom } from 'jotai'
import {
	gameParamsCookieAtom,
	sticksArrCookieAtom,
} from '../../../app/stores/game/game-store'
import { PresettingPushBtn } from '../ui/presseting-push-btn'

export function PressetingFormMode4() {
	const [allCount, setAllCount] = useState<ISliderState>(5)
	const [RangeStreak, setRangeStreak] = useState<ISliderRangeState>([1, 50])
	const [helpsCount, setHelpsCount] = useState<ISliderState>(1)

	const setSticksArr = useSetAtom(sticksArrCookieAtom)
	const setGameParams = useSetAtom(gameParamsCookieAtom)
	const [isFirstComputerStep, setIsFirstComputerStep] = useState(false)

	useEffect(() => {
		if (RangeStreak[1] > allCount) setRangeStreak(prev => [prev[0], allCount])
	}, [allCount])
	// to fix a bug between two sliders

	const handlePlayClick = () => {
		setGameParams({
			sticksCount: allCount,
			sticksRangeStreak: RangeStreak,
			maxPerStep: undefined,
			maxPerStepStreak: undefined,
			sticksRange: undefined,
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

			<PlayButton onClick={handlePlayClick} />
		</div>
	)
}
