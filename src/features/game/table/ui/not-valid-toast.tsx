import { getGameModeDataFromCookies } from '../../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'

export function NotValidToast() {
	const { modeName, modeDesc } = getGameModeDataFromCookies()

	
	return (
		<div className='text-[#e8e8e8] rounded-3xl max-w-[600px]'>
			<p className='w-full rounded-t-2xl bg-[#6d4242] p-2'>
				Неверный ход в режиме "{modeName}" !
			</p>
			<div className='p-2 pb-3  bg-[#3E3E3E] flex flex-col'>
				<p>{modeDesc}</p>
			</div>
		</div>
	)
}
