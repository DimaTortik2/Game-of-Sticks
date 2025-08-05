
import { calculateGrundyCache } from "../../../game/game-logic"

type GrundyCache = Map<string, number>

export const cacheService = {
	loadFromServer: async (): Promise<GrundyCache> => {
		const response = await fetch('/cache.json')
		if (!response.ok) {
			throw new Error('Не удалось загрузить кэш с сервера')
		}
		const data: [string, number][] = await response.json()
		return new Map(data)
	},

	loadFromFile: (file: File): Promise<GrundyCache> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = event => {
				try {
					const result = event.target?.result
					if (typeof result !== 'string') {
						return reject(new Error('Не удалось прочитать файл'))
					}
					const data: [string, number][] = JSON.parse(result)
					resolve(new Map(data))
				} catch (e) {
					reject(new Error('Ошибка парсинга JSON из файла'))
				}
			}
			reader.onerror = () => reject(new Error('Ошибка чтения файла'))
			reader.readAsText(file)
		})
	},

	// Эта функция теперь просто обертка над нашей чистой функцией из lib
	calculate: (
		maxSticks: number,
		onProgress: (percent: number) => void
	): Promise<GrundyCache> => {
		return new Promise(resolve => {
			// Оборачиваем в Promise, чтобы симуляция "загрузки" была асинхронной
			// и не блокировала рендер
			setTimeout(() => {
				const result = calculateGrundyCache(maxSticks, onProgress)
				resolve(result)
			}, 50) // Небольшая задержка, чтобы UI успел обновиться до начала расчетов
		})
	},
}
