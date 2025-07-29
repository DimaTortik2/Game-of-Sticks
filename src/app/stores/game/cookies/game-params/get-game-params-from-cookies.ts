import Cookies from 'js-cookie'

export function getGameParamsFromCookies() {
	const gameParams = JSON.parse(Cookies.get('gameParams') || '{}')

	return gameParams
}
