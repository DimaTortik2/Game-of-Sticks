import { MusicButton } from '../../../music'
import { GameTableBtn } from './game-table-btn'
import { HelpBtn } from './help-btn'

export function GameTools({
	isDev,
	onHelpClick, // 1. Принимаем новый пропс
}: {
	isDev: boolean
	onHelpClick: () => void // 2. Описываем его тип
}) {
	return (
		<div className='absolute left-[20px] bottom-[20px] z-20 flex gap-5 items-center'>
			<MusicButton className='w-[64px] h-[64px] z-[20] bg-[#3d3d3d]' />
			<GameTableBtn isVisible={isDev} className='w-[64px] h-[64px]' />
			<HelpBtn onClick={onHelpClick} />
		</div>
	)
}
