import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { isMusicPlayingAtom } from '../../../app/stores/game/game-store'

const musicMap: Record<string, string> = {
	'/': '/music/menu-music.mp3',
	'/presettings': '/music/menu-music.mp3',
	'/preset': '/music/menu-music.mp3',
	'/game': '/music/game-music.mp3',
}

// ==================================================================
// 1. ✅ ГЛАВНОЕ ИЗМЕНЕНИЕ: Создаем плеер ОДИН РАЗ вне компонента.
// Теперь это настоящий синглтон - он один на все приложение.
// ==================================================================
const audioPlayer = new Audio()
audioPlayer.loop = true
audioPlayer.volume = 0.5

export function MusicController() {
	const location = useLocation()
	const isPlaying = useAtomValue(isMusicPlayingAtom)
	const [isUnlocked, setIsUnlocked] = useState(false)
	// ❌ audioRef больше не нужен

	useEffect(() => {
		const activeTrack = musicMap[location.pathname] || null

		// 2. ✅ Удаляем инициализацию плеера из useEffect.
		// const audio = audioRef.current; // Заменяем на:
		const audio = audioPlayer // 3. ✅ Используем глобальный `audioPlayer`

		const newSrc = activeTrack ? window.location.origin + activeTrack : ''

		// Логика смены трека
		if (audio.src !== newSrc) {
			console.log(`Смена трека на: ${activeTrack}`)
			audio.pause()
			audio.src = activeTrack || ''

			if (isPlaying && activeTrack && isUnlocked) {
				audio
					.play()
					.catch(e => console.error('Ошибка воспроизведения нового трека:', e))
			}
		}
		// Логика паузы/воспроизведения
		else {
			if (isPlaying && activeTrack && isUnlocked) {
				if (audio.paused) {
					audio
						.play()
						.catch(e => console.error('Ошибка возобновления трека:', e))
				}
			} else {
				audio.pause()
			}
		}
	}, [location, isPlaying, isUnlocked])

	// Эффект для разблокировки аудио
	useEffect(() => {
		const unlockAudio = () => {
			if (!isUnlocked) {
				console.log('Аудио контекст разблокирован первым кликом!')
				// Используем глобальный плеер для "пробуждения"
				audioPlayer.play().catch(() => {})
				audioPlayer.pause()
				setIsUnlocked(true)
				window.removeEventListener('click', unlockAudio)
			}
		}
		window.addEventListener('click', unlockAudio)
		return () => {
			window.removeEventListener('click', unlockAudio)
		}
	}, [isUnlocked])

	return null
}
