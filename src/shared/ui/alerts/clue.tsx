import { useEffect, useState } from 'react'
import { ALERTS } from './alerts'
import ClearIcon from '@mui/icons-material/Clear'
import { IconButton } from '../icons/icon-button'
import clsx from 'clsx'
import Cookies from 'js-cookie'

export function Clue() {
	const getRandText = () => ALERTS[Math.floor(Math.random() * ALERTS.length)]
	const [text, setText] = useState(getRandText())

	useEffect(() => {
		const interval = setInterval(() => setText(getRandText()), 10000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	const [isVisible, setIsVisible] = useState(Cookies.get('noClue') !== 'true')

	return isVisible ? (
		<div
			className={clsx(
				'py-5 pr-5 bg-[#3e3e3e] absolute bottom-[20px] right-[20px] rounded-2xl flex max-w-[500px]',
				!isVisible && 'opacity-0 transition-opacity'
			)}
		>
			<div className='h-full'>
				<IconButton onClick={() => setIsVisible(false)} icon={<ClearIcon />} />
			</div>
			{text}
		</div>
	) : (
		<></>
	)
}
