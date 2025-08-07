import { useRef } from 'react'

export function useDevTimer(onComplite: () => void) {
	const arrowClicksCountRef = useRef<number>(0)
	const timerRef = useRef<any>(null)
  
	const handleArrowClick = () => {
		if (arrowClicksCountRef.current === 1) {
			timerRef.current = setTimeout(() => {
				console.log({ clicks: arrowClicksCountRef.current })
				if (arrowClicksCountRef.current >= 6) {
					onComplite()
				}
				arrowClicksCountRef.current = 0
			}, 5000)
		}

		arrowClicksCountRef.current++
	}
	return { handleArrowClick }
}
