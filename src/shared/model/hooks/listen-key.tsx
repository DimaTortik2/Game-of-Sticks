import { useEffect } from 'react'

export function useListenKey(data: { fn: () => void; key: string }[]) {
	const handleKeyDown = (e: KeyboardEvent) => {
		data.forEach(d => {
			if (e.key === d.key) d.fn()
		})
	}
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)

    console.log('he')
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [data])
}
