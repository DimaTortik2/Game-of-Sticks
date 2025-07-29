import CallReceivedIcon from '@mui/icons-material/CallReceived'
import { IconButton } from '../../../../shared/ui/icons/icon-button'
import { useState, useEffect } from 'react'
import { pluralizeSticks } from '../helpers/pluralize'
import { PREDEFINED_COLORS } from '../../../../app/consts/colors'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import {
	sticksArrCookieAtom,
	tableAtom,
} from '../../../../app/stores/game/game-store'

interface GameTableProps {
	closeToast?: () => void
}

export function GameTable({ closeToast }: GameTableProps) {
	// ✅ 2. Используем единый хук useAtom для палочек
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)

	// ✅ 3. Используем единый хук useAtom для настроек
	const [settings, setSettings] = useAtom(tableAtom)

	const [inputValues, setInputValues] = useState({
		skip: settings.skip.toString(),
		take: settings.take.toString(),
	})

	// Синхронизация инпутов с глобальным состоянием
	useEffect(() => {
		setInputValues({
			skip: settings.skip.toString(),
			take: settings.take.toString(),
		})
	}, [settings])

	// Состояние для управления видом: таблица или палитра
	const [view, setView] = useState<'table' | 'color-picker'>('table')
	// Временно выбранный цвет в палитре
	const [tempSelectedColor, setTempSelectedColor] = useState<string>('')

	const handleInputChange = (field: 'skip' | 'take', value: string) => {
		if (/^\d*$/.test(value)) {
			const numericValue = value === '' ? 0 : parseInt(value, 10)
			setInputValues(prev => ({
				...prev,
				[field]: numericValue > 50 ? '50' : value,
			}))
			setSettings(prev => ({
				...prev,
				[field]: numericValue > 50 ? 50 : numericValue,
			}))
		}
	}

	const handleOpenColorPicker = () => {
		setTempSelectedColor(settings.color)
		setView('color-picker')
	}

	const handleSelectColor = (color: string) => {
		setSettings(prev => ({ ...prev, color }))
		setView('table')
	}

	const handleFocus = (field: 'skip' | 'take') => {
		if (inputValues[field] === '0') {
			setInputValues(prev => ({ ...prev, [field]: '' }))
		}
	}

	const handleBlur = (field: 'skip' | 'take') => {
		if (inputValues[field] === '') {
			setInputValues(prev => ({ ...prev, [field]: '0' }))
		}
	}

	// ✅ Эта функция теперь будет работать корректно
	const handleSelectBtnClick = () => {
		if (!sticksArr) {
			console.error('Массив палочек не загружен.')
			return
		}

		const colorIndex = PREDEFINED_COLORS.findIndex(c => c === settings.color)

		if (colorIndex === -1) {
			console.error('Выбранный цвет не найден в палитре.')
			return
		}

		const sticksOfSameColor = sticksArr.filter(
			stick => stick.groupId === colorIndex
		)

		const sticksToSelect = sticksOfSameColor.slice(
			settings.skip,
			settings.skip + settings.take
		)

		const idsToSelect = new Set(sticksToSelect.map(stick => stick.id))

		const newSticksArr = sticksArr.map(stick => ({
			...stick,
			isSelected: idsToSelect.has(stick.id),
		}))

		setSticksArr(newSticksArr)
	}

	return (
		<div className='w-[400px] h-[310px] bg-[#3e3e3e] text-[#e8e8e8] rounded-2xl'>
			{/* header */}
			<div className='py-3 pl-5 pr-3 flex w-full bg-[#212121] rounded-t-2xl'>
				<div className='w-[368px] flex px-2 gap-30'>
					<p className='w-1/2 flex items-end'>Параметр</p>
					<p className='w-1/2 flex items-end'>Значение</p>
				</div>
				<IconButton onClick={closeToast} icon={<CallReceivedIcon />} />
			</div>
			{/* body */}
			{view === 'table' ? (
				<div className='w-full h-full p-4 flex flex-col gap-4'>
					{/* row */}
					<div className=' flex gap-4'>
						<div className='bg-[#21212160] p-[10px] rounded-2xl w-[200px]'>
							<p>Цвет фрагмента</p>
						</div>
						<div
							onClick={handleOpenColorPicker}
							className='bg-[#212121] p-[10px] rounded-2xl w-[150px] flex justify-center cursor-pointer'
						>
							<div
								className='rounded-full w-[25px] h-[25px] '
								style={{ backgroundColor: settings.color }}
							></div>
						</div>
					</div>
					{/* row */}
					<div className=' flex gap-4'>
						<div className='bg-[#21212160] p-[10px] rounded-2xl w-[200px]'>
							<p>Оставить слева</p>
						</div>
						<div className='bg-[#212121] p-[10px] rounded-2xl w-[150px] flex justify-between'>
							<input
								type='text'
								inputMode='numeric'
								value={inputValues.skip}
								onChange={e => handleInputChange('skip', e.target.value)}
								className='w-12 bg-transparent text-center outline-none focus:bg-white/10 rounded-2xl'
								onFocus={() => handleFocus('skip')}
								onBlur={() => handleBlur('skip')}
							/>
							<p>{pluralizeSticks(settings.skip)}</p>
						</div>
					</div>
					{/* row */}
					<div className=' flex gap-4'>
						<div className='bg-[#21212160] p-[10px] rounded-2xl w-[200px]'>
							<p>Забрать</p>
						</div>
						<div className='bg-[#212121] p-[10px] rounded-2xl w-[150px]  flex justify-between'>
							<input
								type='text'
								inputMode='numeric'
								value={inputValues.take}
								onChange={e => handleInputChange('take', e.target.value)}
								className='w-12 bg-transparent text-center outline-none focus:bg-white/10 rounded-2xl'
								onFocus={() => handleFocus('take')}
								onBlur={() => handleBlur('take')}
							/>
							<p>{pluralizeSticks(settings.take)}</p>
						</div>
					</div>
					{/* row */}
					<div className=' flex gap-4'>
						<div
							onClick={handleSelectBtnClick}
							className='bg-[#21212160] p-[10px] rounded-2xl w-[400px] flex justify-center transition-all transform hover:scale-102 cursor-pointer hover:bg-[#6b6b6b60]'
						>
							<p>Выделить</p>
						</div>
					</div>
				</div>
			) : (
				<div className='w-full h-[250px] p-4 flex justify-center items-center '>
					<div className='w-full h-full flex justify-start items-center flex-wrap gap-3 p-2'>
						{PREDEFINED_COLORS.map(color => (
							<div
								key={color}
								onClick={() => {
									setTempSelectedColor(color)
									handleSelectColor(color)
								}}
								className={clsx(
									'w-10 h-10 rounded-full cursor-pointer transition-all transform hover:scale-110',
									tempSelectedColor === color &&
										'ring-2 ring-offset-2 ring-offset-[#3e3e3e] ring-white'
								)}
								style={{ backgroundColor: color }}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
