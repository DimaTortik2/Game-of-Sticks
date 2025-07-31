import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import {
	gameParamsCookieAtom,
	isHelpingAtom,
} from '../../../../app/stores/game/game-store'
import { useAtomValue } from 'jotai'
import { Tooltip } from '@mui/material'

// 1. Добавляем onClick в интерфейс пропсов
export function HelpBtn({ onClick }: { onClick: () => void }) {
	const gameParams = useAtomValue(gameParamsCookieAtom)
	const isHelping = useAtomValue(isHelpingAtom)
	const { helpsCount } = gameParams

	const isVisible =
		helpsCount !== undefined &&
		helpsCount > 0 &&
		!isHelping &&
		!gameParams.isEnemyStep
	// handleClick больше не нужен, мы используем пропс

	return isVisible ? (
		<div className='flex gap-1 items-end'>
			<Tooltip
				title={'Подсказка сделает ход за Вас)'}
				componentsProps={{
					tooltip: {
						sx: {
							fontSize: '1rem',
							backgroundColor: '#e8e8e8',
							color: '#212121',
							borderRadius: '10px',
							padding: 1.5,
						},
					},
				}}
			>
				<div
					className='p-5 rounded-full bg-[#3e3e3e] flex justify-center items-center transition-transform transform hover:scale-110 cursor-pointer'
					// 2. Используем onClick из пропсов
					onClick={onClick}
				>
					<TipsAndUpdatesIcon />
				</div>
			</Tooltip>
			<div className='p-1 rounded-full bg-[#3e3e3e] h-[2.25rem] w-[2.25rem] flex justify-center items-center '>
				{helpsCount}
			</div>
		</div>
	) : (
		<></>
	)
}
