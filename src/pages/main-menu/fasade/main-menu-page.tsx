import { GAME_MODES } from '../model/consts'
import { GameModeLink } from '../ui/game-mode-link'

import { BottomBtns } from '../../../features/bottom-btns'
import { ShinyTitle } from '../ui/shiny-ttitle'
import { MainPageBackground } from '../../../shared/ui/bg/main-page-background'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { setGameModeDataToCookies } from '../../../app/stores/game/cookies/game-mode/set-game-mode-data-to-cookies'

export const MainMenuPage = () => {
	return (
		<div className='relative h-screen w-full bg-[#212121] flex items-center justify-center overflow-hidden font-sans'>
			<MainPageBackground />

			<div
				id='main-scroll-container'
				className='relative z-10 w-screen h-screen overflow-y-auto overflow-x-hidden hidden-scrollbar '
			>
				<main className=' h-full p-8 flex justify-center gap-16'>
					<div className='flex flex-col gap-6 w-full'>
						{GAME_MODES.map(mode => (
							<GameModeLink
								key={mode.number}
								to={'/preset'}
								number={mode.number}
								title={mode.name}
								description={mode.description}
								onClick={() => {
									setGameModeDataToCookies({
										modeNum: mode.number,
										modeName: mode.name,
										modeDesc: mode.description,
									})
								}}
							/>
						))}
					</div>

					<div className=' flex h-screen items-start justify-end'>
						<div className='inline-flex flex-col gap-8 '>
							<Btn className='bg-[#212121] text-[#e8e8e8] w-full max-w-md'>
								Обучение как играть
							</Btn>
							<Btn className='bg-[#212121] text-[#e8e8e8] w-full max-w-md'>
								Советы и подсказки
							</Btn>
							<Btn className='bg-[#212121] text-[#e8e8e8] w-full max-w-md'>
								Готовые стратегии и их доказательства
							</Btn>
						</div>
					</div>
				</main>
				<BottomBtns />
				<ShinyTitle />
			</div>
		</div>
	)
}
