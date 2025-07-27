import TocIcon from '@mui/icons-material/Toc'
import { toast } from 'react-toastify'
import { GameTable } from './game-table'
import clsx from 'clsx'

export function GameTableBtn({ className }: { className?: string }) {
	const handleClick = () => {
		toast(<GameTable />, {
			containerId: 'gameTable',
			position: 'bottom-left',
			autoClose: false,
			hideProgressBar: true,
			closeOnClick: false,
			draggable: false, // нельзя перетаскивать мышкой
			closeButton: false,
			className: 'full-width-toast z-20',
		})
	}

	return (
		<div
			onClick={handleClick}
			className={clsx(
				'p-5 rounded-full bg-[#3e3e3e] transition-transform transform hover:scale-110 cursor-pointer',
				className
			)}
		>
			<TocIcon />
		</div>
	)
}
