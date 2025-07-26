import Checkbox from '@mui/material/Checkbox'
import Cookies from 'js-cookie'
import { useState } from 'react'

export function BottomBtns() {
	const [isChecked, setIsChecked] = useState(Cookies.get('noClue') === 'true')

	const handleClueCBClick = () => {
		if (Cookies.get('noClue') === 'true') {
			Cookies.set('noClue', 'false')
			setIsChecked(false)
		} else {
			Cookies.set('noClue', 'true')
			setIsChecked(true)
		}
	}

	return (
		<div className='absolute w-[90%] bottom-[20px] left-1/2 -translate-x-1/2 z-[1000] flex gap-5 justify-start items-center bg-[#3e3e3e] p-5 rounded-2xl text-[#e8e8e8]'>
			<div className='flex gap-5'>
				<p>Отключить всплывающие подсказки</p>
				<Checkbox
					checked={isChecked}
					onChange={handleClueCBClick}
					value='male'
					name='gender-radio-buttons'
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
