import Checkbox from '@mui/material/Checkbox'
import Cookies from 'js-cookie'
import { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { MusicButton } from '../../music'
import Tooltip from '@mui/material/Tooltip'
import clsx from 'clsx'

export function BottomBtns() {
	const [isArrowClicked, setIsArrowClicked] = useState(false)

	const [isDevChecked, setIsDevChecked] = useState(
		Cookies.get('devMode') === 'true'
	)

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
		<div className='absolute bottom-[20px] left-[20px] z-[1000] flex gap-1 items-center'>
			<Tooltip
				title={isArrowClicked ? 'Вверх' : ' Вниз'}
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
					className='rounded-full bg-[#3e3e3e] h-10 w-10 text-[#e8e8e8] flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform p-7'
					onClick={() => {
						setIsArrowClicked(prev => !prev)

						const scrollContainer = document.getElementById(
							'main-scroll-container'
						)

						if (scrollContainer) {
							scrollContainer.scrollTo({
								top: isArrowClicked ? 0 : scrollContainer.scrollHeight,
								behavior: 'smooth',
							})
						} else {
							console.warn('Не найден контейнер с id="main-scroll-container".')
						}
					}}
				>
					<KeyboardArrowDownIcon
						sx={{ fontSize: 40 }}
						className={clsx(
							'transition-transform ',
							isArrowClicked && 'transform rotate-180'
						)}
					/>
				</div>
			</Tooltip>
			<MusicButton className='mx-2 w-4 h-4 p-7 z-[20]' isSmall={true} />

			<div className=' flex gap-5 justify-start items-center bg-[#3e3e3e] p-5 rounded-2xl text-[#e8e8e8]'>
				<Tooltip
					title={'Режим с подсветкой палочек (для избранных)'}
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
					<div className='flex gap-5 h-full items-center'>
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
				</Tooltip>
			</div>
		</div>
	)
}
