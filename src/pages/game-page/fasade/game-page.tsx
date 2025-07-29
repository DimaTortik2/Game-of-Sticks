import clsx from 'clsx'
import { GameFiled } from '../../../features/game/field'

import { getGameParamsFromCookies } from '../../../app/stores/game/cookies/game-params/get-game-params-from-cookies'
import { Enviroment } from '../ui/enviroment'

export function GamePage() {
	const { sticksCount } = getGameParamsFromCookies()

	const isSticksLess = Boolean(sticksCount && sticksCount <= 25)

	return (
		<div
			className='relative h-screen w-full bg-[#212121] flex items-center justify-center overflow-hidden font-sans 
        text-[#e8e8e8] 
        '
		>
			<Enviroment />

			<div className='h-screen w-screen flex flex-col'>
				<main className='relative z-10 w-full p-8 flex justify-center items-center gap-16 flex-1'>
					<GameFiled
						className={clsx(
							sticksCount < 10
								? ' w-[95%] max-w-[700px]'
								: sticksCount < 15
								? 'w-[95%] max-w-[1000px]'
								: ' w-[95%] max-w-[1800px] ',
							isSticksLess ? 'h-[35%] max-h-[325px]' : 'h-[70%] max-h-[650px]'
						)}
						isSticksLess={isSticksLess}
					/>
				</main>
			</div>
		</div>
	)
}
