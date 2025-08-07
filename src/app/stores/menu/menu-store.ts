import { atom } from 'jotai'
import { setIsDevBtnVisibleToCookies } from './cookies/winner/set-is-dev-visible-to-cookies'
import { getWIsDevBtnVisibleFromCookies } from './cookies/winner/get-is-dev-visible-from-cookies'

const IsDevBtnVisibleAtom = atom<boolean>(getWIsDevBtnVisibleFromCookies())

export const IsDevBtnVisibleCookieAtom = atom(
	get => get(IsDevBtnVisibleAtom),

	(_, set, newValue: boolean) => {
		setIsDevBtnVisibleToCookies(newValue)
		set(IsDevBtnVisibleAtom, newValue)
	}
)
