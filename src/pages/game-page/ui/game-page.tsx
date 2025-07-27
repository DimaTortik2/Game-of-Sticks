import clsx from 'clsx'
import { GameFiled } from '../../../features/game/field'
import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { getGameParamsFromCookies } from '../helpers/get-game-params-from-cookies'

export function GamePage() {
	const { sticksCount } = getGameParamsFromCookies()

	const isSticksLess = Boolean(sticksCount && sticksCount < 25)

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
