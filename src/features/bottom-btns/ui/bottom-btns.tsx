import Checkbox from '@mui/material/Checkbox'
import Cookies from 'js-cookie'
import { useState } from 'react'

export function BottomBtns() {
	const [isClueChecked, setIsClueChecked] = useState(
		Cookies.get('noClue') === 'true'
	)
	const [isDevChecked, setIsDevChecked] = useState(
		Cookies.get('devMode') === 'true'
	)

	const handleClueClick = () => {
		if (Cookies.get('noClue') === 'true') {
			Cookies.set('noClue', 'false')
			setIsClueChecked(false)
		} else {
			Cookies.set('noClue', 'true')
			setIsClueChecked(true)
		}
	}

	const handleDevClick = () => {
		if (Cookies.get('devMode') === 'true') {
			Cookies.set('devMode', 'false')
			setIsDevChecked(false)
		} else {
			Cookies.set('devMode', 'true')
			setIsDevChecked(true)
		}
	}

	return (
		<div className='absolute bottom-[20px] left-[20px] z-[1000] flex gap-5 justify-start items-center bg-[#3e3e3e] p-5 rounded-2xl text-[#e8e8e8]'>
			<div className='flex gap-5'>
				<p>Отключить всплывающие подсказки</p>
				<Checkbox
					checked={isClueChecked}
					onChange={handleClueClick}
					// name='gender-radio-buttons'
					sx={{
						height: '24px',
						width: '24px',
						color: '#aaa', // цвет, когда НЕ выбран
						'&.Mui-checked': {
							color: '#e8e8e8', // цвет, когда выбран
						},
					}}
					className='transition-transform transform hover:scale-110'
				/>
			</div>

			<div className='flex gap-5'>
				<p>Режим разработчика</p>
				<Checkbox
					checked={isDevChecked}
					onChange={handleDevClick}
					sx={{
						height: '24px',
						width: '24px',
						color: '#aaa', // цвет, когда НЕ выбран
						'&.Mui-checked': {
							color: '#e8e8e8', // цвет, когда выбран
						},
					}}
					className='transition-transform transform hover:scale-110'
				/>
			</div>
		</div>
	)
}
