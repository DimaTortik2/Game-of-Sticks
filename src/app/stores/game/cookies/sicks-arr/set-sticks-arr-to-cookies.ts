import Cookies from 'js-cookie'
import type { IStick } from '../../../../../entities/sticks/model/interfaces/stick.interfaces'

export function setSticksArrToCookies(sticksArr?: IStick[]) {
	return sticksArr
		? Cookies.set('sticksArr', JSON.stringify(sticksArr))
		: console.log('не получилось положить в куки ', sticksArr)
}
