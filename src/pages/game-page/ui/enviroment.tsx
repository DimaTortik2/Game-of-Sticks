import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import clsx from 'clsx'
import { ToastContainer } from 'react-toastify'
import { GameTools } from '../../../features/game/table'

import { EndGameModal } from '../../../features/game/table/ui/end-game-modal'
import { GameParams } from '../../../widgets/game/ui/game-params'
import { useGame } from '../../../features/game/game-logic'


export function Enviroment() {

const {
	gameParams,
	isDev,
	modeNum,
	isEnemyStep,
	isHelping,
	selectedSticksCount,
	handlePlayerTurn, // Это ваш mainlogic
	handleHelpClick, // Это ваш handleHelpClick
} = useGame()

	return (
		<>
			<EndGameModal />

			<GameParams
				gameParams={gameParams}
				modeNum={modeNum}
				className='absolute top-[20px] right-[20px] z-20'
			/>

			<ToastContainer
				containerId={'gameTable'}
				position='bottom-left'
				autoClose={false}
				hideProgressBar={true}
				closeOnClick={false}
				draggable={false}
			/>

			<GameTools isDev={isDev} onHelpClick={handleHelpClick} />

			<GamePageBackground />

			<ExitLinkButton to='/' className='absolute left-[20px] top-[20px] z-20'>
				Выход
			</ExitLinkButton>

			<GameState
				className='absolute left-1/2 transform -translate-x-1/2 top-[20px] select-none z-20'
				isEnemyStep={isEnemyStep}
				selectedCount={selectedSticksCount}
				isHelping={isHelping}
			/>

			<Btn
				className={clsx(
					'bg-[#BA7821] text-[#e8e8e8] w-full max-w-md absolute bottom-[50px] transition-opacity z-20 select-none duration-300 ease-in-out',
					selectedSticksCount > 0 && !isEnemyStep
						? 'opacity-100'
						: 'opacity-0 pointer-events-none'
				)}
				onClick={handlePlayerTurn}
			>
				Забрать
			</Btn>
		</>
	)
}
