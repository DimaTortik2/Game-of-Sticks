import Cookies from 'js-cookie'

export function setSticksOnFieldToCookies( arr: number[][] ) {
	Cookies.set('sticksOnField', JSON.stringify(arr))
}
