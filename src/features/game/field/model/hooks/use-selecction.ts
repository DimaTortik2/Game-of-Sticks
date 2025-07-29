import { useState, useRef, useCallback } from 'react'
import type { MouseEvent } from 'react'
import type { IStick } from '../../../../../entities/sticks/model/interfaces/stick.interfaces';

type Point = { x: number; y: number }

export const useSelection = (
	containerRef: React.RefObject<HTMLElement | null>,
	// Принимаем текущий массив палочек и функцию для его обновления
	sticksArr: IStick[],
	setSticksArr: (newSticks: IStick[]) => void
) => {
	const [isDragging, setIsDragging] = useState(false)
	const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 })
	const [endPoint, setEndPoint] = useState<Point>({ x: 0, y: 0 })

	const itemRefs = useRef<Map<string | number, HTMLElement>>(new Map())

	const registerItemRef = useCallback(
		(id: string | number, element: HTMLElement | null) => {
			if (element) {
				itemRefs.current.set(id, element)
			} else {
				itemRefs.current.delete(id)
			}
		},
		[]
	)

	const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
		if (e.target !== containerRef.current || e.button !== 0) return

		setIsDragging(true)
		setStartPoint({ x: e.clientX, y: e.clientY })
		setEndPoint({ x: e.clientX, y: e.clientY })

		// Если не зажат Ctrl/Cmd, сбрасываем выделение
		if (!e.metaKey && !e.ctrlKey) {
			const newSticks = sticksArr.map(stick =>
				stick.isSelected ? { ...stick, isSelected: false } : stick
			)
			// Проверяем, действительно ли что-то изменилось, чтобы избежать лишнего ре-рендера
			if (newSticks.some((s, i) => s !== sticksArr[i])) {
				setSticksArr(newSticks)
			}
		}
	}

	const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
		if (!isDragging) return
		setEndPoint({ x: e.clientX, y: e.clientY })
	}

	const handleMouseUp = () => {
		if (!isDragging) return
		setIsDragging(false)

		const selectionBox = {
			left: Math.min(startPoint.x, endPoint.x),
			right: Math.max(startPoint.x, endPoint.x),
			top: Math.min(startPoint.y, endPoint.y),
			bottom: Math.max(startPoint.y, endPoint.y),
		}

		// Вычисляем, какие палочки попали в область выделения
		const newSticks = sticksArr.map(stick => {
			const element = itemRefs.current.get(stick.id)
			if (!element) return stick

			const itemRect = element.getBoundingClientRect()
			const isIntersecting =
				itemRect.left < selectionBox.right &&
				itemRect.right > selectionBox.left &&
				itemRect.top < selectionBox.bottom &&
				itemRect.bottom > selectionBox.top

			// Если палочка пересеклась, инвертируем ее состояние isSelected
			if (isIntersecting) {
				return { ...stick, isSelected: !stick.isSelected }
			}
			return stick
		})

		setSticksArr(newSticks)
	}

	const handleItemClick = (id: string | number, e: MouseEvent) => {
		e.stopPropagation()

		const newSticks = sticksArr.map(stick => {
			if (stick.id === id) {
				// Логика клика с Ctrl/Cmd
				if (e.metaKey || e.ctrlKey) {
					return { ...stick, isSelected: !stick.isSelected }
				}
				// Логика обычного клика (выделить только эту, остальные снять)
				return { ...stick, isSelected: true }
			}
			// Если это не целевая палочка, при обычном клике снимаем выделение
			if (!e.metaKey && !e.ctrlKey) {
				return { ...stick, isSelected: false }
			}
			return stick
		})

		setSticksArr(newSticks)
	}

	const selectionBoxCoords = {
		left: Math.min(startPoint.x, endPoint.x),
		top: Math.min(startPoint.y, endPoint.y),
		width: Math.abs(startPoint.x - endPoint.x),
		height: Math.abs(startPoint.y - endPoint.y),
	}

	return {
		isDragging,
		selectionBoxCoords,
		eventHandlers: {
			onMouseDown: handleMouseDown,
			onMouseMove: handleMouseMove,
			onMouseUp: handleMouseUp,
			onMouseLeave: handleMouseUp,
		},
		getItemProps: (id: string | number) => ({
			onClick: (e: MouseEvent) => handleItemClick(id, e),
			ref: (element: HTMLElement | null) => registerItemRef(id, element),
		}),
	}
}
