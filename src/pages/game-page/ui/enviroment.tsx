import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Clue } from '../../../shared/ui/alerts/clue'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { useAtom } from 'jotai'
import { selectedSticksIdsAtom } from '../../../app/stores/game/game-store'
import clsx from 'clsx'

export function Enviroment() {
	const [selectedSticksIds, setSelectedSticksIds] = useAtom(
		selectedSticksIdsAtom
	)

	return (
		<>
			<GamePageBackground />

			<ExitLinkButton
				to='/'
				onClick={() => setSelectedSticksIds(new Set())}
				className='absolute left-[20px] top-[20px] z-20'
			>
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
		</>
	)
}
