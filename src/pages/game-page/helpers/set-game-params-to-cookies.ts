import Cookies from 'js-cookie'

export function setGameParamsToCookies({
	sticksCount,
}: {
	sticksCount: number
}) {
	Cookies.set('sticksCount', String(sticksCount))
}
