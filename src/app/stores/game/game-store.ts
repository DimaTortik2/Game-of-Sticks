import { atom } from 'jotai'
import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'
import { setSticksArrToCookies } from './cookies/sicks-arr/set-sticks-arr-to-cookies'
import { getSticksArrFromCookies } from './cookies/sicks-arr/get-sticks-arr-from-cookies'
import { PREDEFINED_COLORS } from '../../../features/game/table/model/consts/colors'

// 1. Базовый атом. Он инициализируется СРАЗУ значением из кук.
// Это наш единственный источник правды в памяти.
const sticksArrAtom = atom<IStick[] | undefined>(
	getSticksArrFromCookies() as IStick[] | undefined
)

// 2. Производный атом для записи и чтения. Он работает с базовым атомом.
export const sticksArrCookieAtom = atom(
	// Функция чтения просто возвращает значение из базового атома.
	get => get(sticksArrAtom),

	// Функция записи обновляет и куки, и базовый атом.
	(_, set, newSticks: IStick[] | undefined) => {
		setSticksArrToCookies(newSticks) // Сначала пишем в куки
		set(sticksArrAtom, newSticks) // Затем обновляем атом в памяти
	}
)

export const tableAtom = atom({
	color: PREDEFINED_COLORS[0],
	skip: 0,
	take: 1,
})
