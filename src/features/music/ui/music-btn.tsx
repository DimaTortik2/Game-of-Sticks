import { useAtom } from 'jotai'
import VolumeUpIcon from '@mui/icons-material/VolumeUp' // Иконка "звук включен"
import VolumeOffIcon from '@mui/icons-material/VolumeOff' // Иконка "звук выключен"
import { isMusicPlayingAtom } from '../../../app/stores/game/game-store'
import clsx from 'clsx'
import Tooltip from '@mui/material/Tooltip'

export function MusicButton({ className, isSmall }: { className?: string; isSmall?: boolean }) {
	const [isPlaying, setIsPlaying] = useAtom(isMusicPlayingAtom)

	const toggleMusic = () => {
		setIsPlaying(prev => !prev)
	}

	return (
		<Tooltip
			title={'Авторская музыка'}
			componentsProps={{
				tooltip: {
					sx: {
						fontSize: '1rem',
            backgroundColor: '#212121'
					},
				},
			}}
		>
			<button
				onClick={toggleMusic}
				className={clsx(
					'p-5 bg-[#3e3e3e]  text-[#e8e8e8] rounded-full flex items-center justify-center transition-transform transform hover:scale-105 cursor-pointer',
					className
				)}
				aria-label={isPlaying ? 'Выключить музыку' : 'Включить музыку'}
			>
				{isPlaying ? (
					isSmall ? (
						<VolumeUpIcon sx={{ fontSize: 30 }} fontSize='large' />
					) : (
						<VolumeUpIcon fontSize='large' />
					)
				) : isSmall ? (
					<VolumeOffIcon sx={{ fontSize: 30 }} fontSize='large' />
				) : (
					<VolumeOffIcon fontSize='large' />
				)}
			</button>
		</Tooltip>
	)
}
