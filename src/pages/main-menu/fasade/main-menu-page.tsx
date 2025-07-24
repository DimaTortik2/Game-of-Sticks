import { GAME_MODES } from '../model/consts'
import { GameModeLink } from '../ui/game-mode-link'
import { InfoBtn } from '../ui/info-btn'
import { setGameModeDataToCookies } from '../../../app/helpers/set-game-mode-data-to-cookies'

export const MainMenuPage = () => {
	return (
		<div className='relative h-screen w-full bg-[#212121] flex items-center justify-center overflow-hidden font-sans '>
			<div
				className='absolute bg-[#d9d9d9] w-[45%] h-[300%] transform -rotate-[-25deg]'
				style={{ right: '0' }}
			></div>
			<div
				className='absolute bg-[#d9d9d9] w-[30%] h-[300%] transform -rotate-[25deg]'
				style={{ left: '20%', top: '-70%' }}
			></div>

			<main className='relative z-10 w-full max-w-[1500px] h-full p-8 flex justify-center gap-16'>
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
						<InfoBtn>Обучение как играть</InfoBtn>
						<InfoBtn>Советы и подсказки</InfoBtn>
						<InfoBtn>Готовые стратегии и их доказательства</InfoBtn>
					</div>
				</div>
			</main>
		</div>
	)
}
