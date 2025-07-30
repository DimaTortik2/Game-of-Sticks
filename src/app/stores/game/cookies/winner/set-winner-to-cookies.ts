import Cookies from 'js-cookie'

export function setWinnerToCookies(
	winner: 'player' | 'enemy' | undefined
) {
	winner
		? Cookies.set('winner', winner)
		: console.log('Не получилось записать winner в куки')
}
