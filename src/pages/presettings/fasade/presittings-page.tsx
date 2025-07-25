import { getGameModeDataFromCookies } from '../../../app/helpers/get-game-mode-data-from-cookies'
import { PresettingFromRender } from '../../../features/presettings'
import { Header } from '../../../widgets/header'

export function PresettingsPage() {
	const { modeDesc, modeName, modeNum } = getGameModeDataFromCookies()

	return (
		<div
			className='relative h-screen w-full bg-[#212121] flex items-center justify-center overflow-hidden font-sans 
    text-[#e8e8e8]
    '
		>
			<div
				className='absolute bg-[#d9d9d9] w-[80%] h-[170%] transform -rotate-[-25deg]'
				style={{ left: '-30%', top: '-100%' }}
			></div>
			<div
				className='absolute bg-[#d9d9d9] w-[70%] h-[300%] transform -rotate-[25deg]'
				style={{ left: '20%', top: '-70%' }}
			></div>

			<div className='h-screen w-screen'>
				<Header modeDesc={modeDesc} modeName={modeName} />

				<main className='relative z-10 w-full max-w-[1500px] h-auto p-8 flex justify-start gap-16'>
					<PresettingFromRender modeNum={modeNum} />
				</main>
			</div>
		</div>
	)
}
