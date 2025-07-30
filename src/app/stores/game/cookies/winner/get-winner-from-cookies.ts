import Cookies from 'js-cookie'

export function getWinnerFromCookies() {
	const winner = Cookies.get('winner')

	return winner
}
