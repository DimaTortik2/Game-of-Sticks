// src/features/game/ui/CacheModal.tsx

import { useRef, useState, type ChangeEvent } from "react"

interface CacheModalProps {
	sticksCount: number
	onLoadFromServer: () => Promise<void>
	onLoadFromFile: (file: File) => Promise<void>
	onCalculate: () => Promise<void>
}

export function CacheModal({
	sticksCount,
	onLoadFromServer,
	onLoadFromFile,
	onCalculate,
}: CacheModalProps) {
	const [status, setStatus] = useState<'idle' | 'loading' | 'calculating'>(
		'idle'
	)
	const [message, setMessage] = useState('')
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setStatus('loading')
		setMessage('Загрузка из файла...')
		await onLoadFromFile(file)
		// Компонент размонтируется после успешной загрузки, сообщение не нужно
	}

	const handleLoadServer = async () => {
		setStatus('loading')
		setMessage('Загрузка с сервера...')
		await onLoadFromServer()
	}

	const handleCalculate = async () => {
		setStatus('calculating')
		setMessage('Идет расчет... Это может занять много времени.')
		await onCalculate()
	}

	return (
		<div
			/* Стили для оверлея */ className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
		>
			<div
				/* Стили для модалки */ className='bg-white p-6 rounded-lg shadow-xl text-black'
			>
				<h3 className='text-xl font-bold mb-4'>
					Требуется кэш для "Особого режима"
				</h3>
				<p className='mb-4'>
					Для игры с {sticksCount} палочками требуется большой объем вычислений.
					Выберите способ получения данных:
				</p>

				{status === 'idle' && (
					<div className='flex gap-4'>
						<button onClick={handleLoadServer} className='menu-button'>
							С сервера
						</button>
						<button
							onClick={() => fileInputRef.current?.click()}
							className='menu-button'
						>
							Из файла
						</button>
						<button onClick={handleCalculate} className='menu-button'>
							Рассчитать
						</button>
					</div>
				)}

				{(status === 'loading' || status === 'calculating') && <p>{message}</p>}

				<input
					type='file'
					ref={fileInputRef}
					onChange={handleFileChange}
					accept='.json'
					className='hidden'
				/>
			</div>
		</div>
	)
}
