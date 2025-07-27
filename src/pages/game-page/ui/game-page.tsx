import clsx from 'clsx'
import { GameFiled } from '../../../features/game/field'
import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { getGameParamsFromCookies } from '../helpers/get-game-params-from-cookies'
import { GameState } from '../../../widgets/game'
import { Clue } from '../../../shared/ui/alerts/clue'
import { useAtomValue } from 'jotai'
import { selectedSticksIdsAtom } from '../../../app/stores/game/game-store'
import { Btn } from '../../../shared/ui/btns-or-links/btn'

export function GamePage() {
	const { sticksCount } = getGameParamsFromCookies()

	const isSticksLess = Boolean(sticksCount && sticksCount <= 25)

	const selectedSticksIds = useAtomValue(selectedSticksIdsAtom)

	return (
		<div
			className='relative h-screen w-full bg-[#212121] flex items-center justify-center overflow-hidden font-sans 
        text-[#e8e8e8] 
        '
		>
			<GamePageBackground />

			<ExitLinkButton to='/' className='absolute left-[20px] top-[20px] z-20'>
				Выход
			</ExitLinkButton>

			<GameState
				className='absolute left-1/2 transform -translate-x-1/2 top-[20px] select-none z-20'
				isEnemyStep={true}
				selectedCount={selectedSticksIds.size}
			/>
			<Clue className='z-20' />

			<Btn
				className={clsx(
					'bg-[#BA7821] text-[#e8e8e8] w-full max-w-md absolute bottom-[50px] transition-opacity opacity-0 z-20 select-none  duration-300 ease-in-out',
					selectedSticksIds.size > 0 && 'opacity-100'
				)}
			>
				Забрать
			</Btn>

			<div className='h-screen w-screen flex flex-col'>
				<main className='relative z-10 w-full p-8 flex justify-center items-center gap-16 flex-1'>
					<GameFiled
						sticksCount={sticksCount}
						className={clsx(
							' w-[95%] max-w-[1800px] ',
							isSticksLess ? 'h-[35%] max-h-[325px]' : 'h-[70%] max-h-[650px]'
						)}
						isSticksLess={isSticksLess}
					/>
				</main>
			</div>
		</div>
	)
}
