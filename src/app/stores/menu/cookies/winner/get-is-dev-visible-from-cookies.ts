import Cookies from 'js-cookie'

export function getWIsDevBtnVisibleFromCookies() {
	console.log({ isDevVisi: Cookies.get('isDevBtnVisible') })

	const data = Cookies.get('isDevBtnVisible') 
	return (data  === 'false' || data === undefined) ? false : true
}
