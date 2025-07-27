import Cookies from 'js-cookie'

export function getSticksOnFieldFromCookies(): number[][] | undefined {
	const cookieValue = Cookies.get('sticksOnField')
	if (cookieValue) {
		try {
			return JSON.parse(cookieValue)
		} catch (err) {
			console.error('Ошибка при чтении sticksOnField из куки', err)
			return undefined
		}
	} else {
		console.log('Не удалось получить sticks on field из куки')
	}
}
