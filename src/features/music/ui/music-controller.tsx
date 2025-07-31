import { useEffect, useRef, useState } from 'react' // 1. Добавляем useState
import { useLocation } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { isMusicPlayingAtom } from '../../../app/stores/game/game-store'

// Карта музыки остается без изменений
const musicMap: Record<string, string> = {
	'/': '/music/menu-music.mp3',
	'/presettings': '/music/menu-music.mp3', // Предполагаю, что у вас есть такая страница
	'/preset': '/music/menu-music.mp3', // И такая
	'/game': '/music/game-music.mp3',
}

export function MusicController() {
	const location = useLocation()
	const isPlaying = useAtomValue(isMusicPlayingAtom)

	// ✅ 2. Новое состояние для "разблокировки" аудио
	// `isUnlocked` означает, что пользователь уже кликнул по странице хотя бы раз.
	const [isUnlocked, setIsUnlocked] = useState(false)

	const audioRef = useRef<HTMLAudioElement | null>(null)

	// Этот useEffect следит за изменением трека и состояния воспроизведения
	useEffect(() => {
		const activeTrack = musicMap[location.pathname] || null

		if (!audioRef.current) {
			audioRef.current = new Audio()
			audioRef.current.loop = true
			// Устанавливаем громкость чуть ниже, чтобы не было слишком громко
			audioRef.current.volume = 0.5
		}

		const audio = audioRef.current

		// Смена трека, если URL изменился
		const newSrc = activeTrack ? window.location.origin + activeTrack : ''
		if (activeTrack && audio.src !== newSrc) {
			console.log(`Смена трека на: ${activeTrack}`)
			audio.src = activeTrack
		} else if (!activeTrack) {
			// Если для страницы нет музыки, останавливаем и очищаем
			audio.pause()
			audio.src = ''
		}

		// Управляем воспроизведением, но ТОЛЬКО ЕСЛИ аудио уже "разблокировано"
		if (isPlaying && activeTrack && isUnlocked) {
			audio.play().catch(e => console.error('Ошибка воспроизведения:', e))
		} else {
			audio.pause()
		}
	}, [location, isPlaying, isUnlocked]) // Добавляем isUnlocked в зависимости

	// ✅ 3. Новый эффект, который "слушает" первый клик
	useEffect(() => {
		const unlockAudio = () => {
			if (!isUnlocked) {
				console.log('Аудио контекст разблокирован первым кликом!')
				// Пытаемся запустить и сразу остановить "пустой" звук.
				// Это "пробуждает" аудио-контекст браузера.
				audioRef.current?.play().catch(() => {})
				audioRef.current?.pause()

				setIsUnlocked(true)
				// Удаляем обработчик после первого успешного клика
				window.removeEventListener('click', unlockAudio)
			}
		}

		// Добавляем обработчик клика на все окно
		window.addEventListener('click', unlockAudio)

		// Функция очистки, чтобы удалить обработчик при размонтировании компонента
		return () => {
			window.removeEventListener('click', unlockAudio)
		}
	}, [isUnlocked]) // Зависимость от isUnlocked, чтобы удалить обработчик

	return null
}
