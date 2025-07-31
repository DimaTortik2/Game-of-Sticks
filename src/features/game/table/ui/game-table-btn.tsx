import TocIcon from '@mui/icons-material/Toc'
import { toast } from 'react-toastify'
import { GameTable } from './game-table'
import clsx from 'clsx'
import Tooltip from '@mui/material/Tooltip'

export function GameTableBtn({
	className,
	isVisible,
}: {
	className?: string
	isVisible: boolean
}) {
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

	return isVisible ? (
		<Tooltip
			title={'Таблица выбора палочек'}
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
				onClick={handleClick}
				className={clsx(
					' p-5 rounded-full bg-[#3e3e3e] transition-transform transform hover:scale-110 cursor-pointer flex items-center justify-center',
					className
				)}
			>
				<TocIcon />
			</div>
		</Tooltip>
	) : (
		<></>
	)
}
