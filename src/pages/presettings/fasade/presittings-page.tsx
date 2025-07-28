import { getGameModeDataFromCookies } from '../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'
import { PresettingFromRender } from '../../../features/presettings'
import { PressetingsPageBackground } from '../../../shared/ui/bg/presettings-page-background'
import { Header } from '../../../widgets/header'

export function PresettingsPage() {
	const { modeDesc, modeName, modeNum } = getGameModeDataFromCookies()

	return (
		<div
			className='relative h-screen w-full bg-[#212121] flex items-center justify-center overflow-hidden font-sans 
    text-[#e8e8e8] 
    '
		>
			<PressetingsPageBackground />

			<div className='h-screen w-screen flex flex-col'>
				<Header modeDesc={modeDesc} modeName={modeName} />

				<main className='relative z-10 w-full p-8 flex justify-start gap-16 flex-1'>
					<PresettingFromRender modeNum={modeNum} />
				</main>
			</div>
		</div>
	)
}
