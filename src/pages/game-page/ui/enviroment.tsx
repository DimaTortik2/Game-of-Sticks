import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Clue } from '../../../shared/ui/alerts/clue'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { useAtom } from 'jotai'

import clsx from 'clsx'
import { ToastContainer } from 'react-toastify'
import { GameTableBtn } from '../../../features/game/table'
import { sticksArrCookieAtom } from '../../../app/stores/game/game-store'
import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'

export function Enviroment() {
	const [sticksArr, setSticksArr] = useAtom<IStick[] | undefined>(
		sticksArrCookieAtom
	)

	let selectedSticksCount = 0
	sticksArr?.forEach(stick => {
		if (stick.isSelected) selectedSticksCount++
	})

	return (
		<>
			<ToastContainer
				containerId={'gameTable'}
				position='bottom-left'
				autoClose={false}
				hideProgressBar={true}
				closeOnClick={false}
				draggable={false} // нельзя перетаскивать мышкой
			/>

			<GameTableBtn className='absolute left-[20px] bottom-[20px] z-20' />

			<GamePageBackground />

			<ExitLinkButton
				to='/'
				onClick={() =>
					console.log('exit должен снимать выделение со всех палочек')
				}
				className='absolute left-[20px] top-[20px] z-20'
			>
				Выход
			</ExitLinkButton>

			<GameState
				className='absolute left-1/2 transform -translate-x-1/2 top-[20px] select-none z-20'
				isEnemyStep={true}
				selectedCount={selectedSticksCount}
			/>
			<Clue className='z-20' />

			<Btn
				className={clsx(
					'bg-[#BA7821] text-[#e8e8e8] w-full max-w-md absolute bottom-[50px] transition-opacity opacity-0 z-20 select-none  duration-300 ease-in-out',
					selectedSticksCount > 0 && 'opacity-100'
				)}
			>
				Забрать
			</Btn>
		</>
	)
}
