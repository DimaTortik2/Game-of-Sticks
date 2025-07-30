import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { gameParamsCookieAtom } from '../../../../app/stores/game/game-store'
import { useAtomValue } from 'jotai'

// 1. Добавляем onClick в интерфейс пропсов
export function HelpBtn({ onClick }: { onClick: () => void }) {
	const gameParams = useAtomValue(gameParamsCookieAtom)
	const { helpsCount } = gameParams

	// handleClick больше не нужен, мы используем пропс

	return (
		<div className='flex gap-1 items-end'>
			<div
				className='p-5 rounded-full bg-[#3e3e3e] flex justify-center items-center transition-transform transform hover:scale-110 cursor-pointer'
				// 2. Используем onClick из пропсов
				onClick={onClick}
			>
				<TipsAndUpdatesIcon />
			</div>
			<div className='p-1 rounded-full bg-[#3e3e3e] h-[2.25rem] w-[2.25rem] flex justify-center items-center '>
				{helpsCount}
			</div>
		</div>
	)
}
