import Cookies from 'js-cookie'

export function getGameParamsFromCookies() {
	const sticksCount = Number(Cookies.get('sticksCount'))

	return {
		sticksCount,
	}
}
