import { getGameModeDataFromCookies } from '../../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'

export function NotValidToast() {
	const { modeName, modeDesc } = getGameModeDataFromCookies()

	
	return (
		<div className='text-[#e8e8e8] rounded-3xl '>
			<p className='w-full rounded-t-2xl bg-[#6d4242] p-3'>
				Неверный ход в режиме "{modeName}" !
			</p>
			<div className='pt-2 px-3 pb-3  bg-[#3E3E3E] flex flex-col'>
				<p>{modeDesc}</p>
			</div>
		</div>
	)
}
