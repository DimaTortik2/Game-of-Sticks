import Cookies from 'js-cookie'
import type { IGameParams } from '../../../interfaces/game-params.interface'

export function setGameParamsToCookies(gameParams: IGameParams ) {
	return gameParams
		? Cookies.set('gameParams', JSON.stringify(gameParams))
		: console.log('не получилось положить в куки ', gameParams)
}
