import Cookies from 'js-cookie'

export function setGameModeDataToCookies({
	modeNum,
	modeName,
	modeDesc,
}: {
	modeNum?: 1 | 2 | 3 | 4 | 5
	modeName: string
	modeDesc: string
}) {
	Cookies.set('modeNum', String(modeNum))
	modeName
		? Cookies.set('modeName', modeName)
		: console.log('Не получилось записать name в куки')
	modeDesc
		? Cookies.set('modeDesc', modeDesc)
		: console.log('Не получилось записать desc в куки')

	return {
		modeNum,
		modeName,
		modeDesc,
	}
}
