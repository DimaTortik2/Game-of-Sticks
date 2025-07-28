import Cookies from 'js-cookie'

export function getSticksArrFromCookies() {
	const sticksArr = JSON.parse(Cookies.get('sticksArr') || '[]')

	return sticksArr
}
