import Cookies from 'js-cookie'

export function setWinnerToCookies(winner: 'player' | 'enemy' | null) {
	if (winner) {
		// Если победитель есть ('player' или 'enemy'), устанавливаем куку.
		Cookies.set('winner', winner)
	} else {
		// Если победитель `null`, это сигнал к удалению куки.
		Cookies.remove('winner')
	}
}
