import Cookies from 'js-cookie'

export function setIsDevBtnVisibleToCookies(isVisible: boolean) {
	Cookies.set('isDevBtnVisible', String(isVisible))
}
