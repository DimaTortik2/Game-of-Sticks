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
		<div className='absolute left-[20px] bottom-[20px] z-20 flex gap-5'>
			<GameTableBtn isVisible={isDev} />
			{/* 3. Передаем onHelpClick в HelpBtn */}
			<HelpBtn
				onClick={onHelpClick}

			/>
		</div>
	)
}
