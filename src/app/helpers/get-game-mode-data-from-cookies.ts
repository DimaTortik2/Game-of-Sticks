import Cookies from 'js-cookie'

export function getGameModeDataFromCookies() {
	const modeNum = Number(Cookies.get('modeNum'))
	const modeName = Cookies.get('modeName')
	const modeDesc = Cookies.get('modeDesc')

	return { modeNum, modeName, modeDesc }
}
