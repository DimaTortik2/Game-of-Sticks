import { useAtomValue } from 'jotai'
import { getGameModeDataFromCookies } from '../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'
import { gameParamsCookieAtom } from '../../../app/stores/game/game-store'
import { nonValidClueText } from '../helpers/insert-into'

export function NotValidToast() {
	const { modeName, modeNum } = getGameModeDataFromCookies()
	const { maxPerStep, maxPerStepStreak, sticksRange, sticksRangeStreak } =
		useAtomValue(gameParamsCookieAtom)

	return (
		<div className='text-[#e8e8e8] rounded-3xl '>
			<p className='w-full rounded-t-2xl bg-[#6d4242] p-3'>
				Неверный ход в режиме "{modeName}" !
			</p>
			<div className='pt-2 px-3 pb-3  bg-[#3E3E3E] flex flex-col'>
				<p>
					{nonValidClueText({
						maxPerStep,
						maxPerStepStreak,
						sticksRange,
						sticksRangeStreak,
						modeNum,
					})}
				</p>
			</div>
		</div>
	)
}
