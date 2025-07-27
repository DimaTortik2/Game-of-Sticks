import { useAtom } from 'jotai'
import { useState, useRef, useCallback } from 'react'
import type { MouseEvent } from 'react'
import { selectedSticksIdsAtom } from '../../../../../app/stores/game/game-store'
type Point = { x: number; y: number }

export const useSelection = (
	containerRef: React.RefObject<HTMLElement | null>
) => {
	const [selectedIds, setSelectedIds] = useAtom(selectedSticksIdsAtom)

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
		if (e.target !== containerRef.current) return
		if (e.button !== 0) return

		if (!e.metaKey && !e.ctrlKey) {
			setSelectedIds(new Set())
		}

		setIsDragging(true)
		containerRef.current?.getBoundingClientRect()
		setStartPoint({ x: e.clientX, y: e.clientY })
		setEndPoint({ x: e.clientX, y: e.clientY })
	}

	const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
		if (!isDragging || !containerRef.current) return
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

		const newlySelectedIds = new Set(selectedIds)

		itemRefs.current.forEach((element, id) => {
			const itemRect = element.getBoundingClientRect()
			const isIntersecting =
				itemRect.left < selectionBox.right &&
				itemRect.right > selectionBox.left &&
				itemRect.top < selectionBox.bottom &&
				itemRect.bottom > selectionBox.top

			if (isIntersecting) {
				if (newlySelectedIds.has(id)) {
					newlySelectedIds.delete(id)
				} else {
					newlySelectedIds.add(id)
				}
			}
		})
		setSelectedIds(newlySelectedIds)
	}

	const handleItemClick = (id: string | number, e: MouseEvent) => {
		e.stopPropagation()

		const newSelectedIds = new Set(selectedIds)
		if (e.metaKey || e.ctrlKey) {
			if (newSelectedIds.has(id)) {
				newSelectedIds.delete(id)
			} else {
				newSelectedIds.add(id)
			}
		} else {
			newSelectedIds.clear()
			newSelectedIds.add(id)
		}
		setSelectedIds(newSelectedIds)
	}

	const selectionBoxCoords = {
		left: Math.min(startPoint.x, endPoint.x),
		top: Math.min(startPoint.y, endPoint.y),
		width: Math.abs(startPoint.x - endPoint.x),
		height: Math.abs(startPoint.y - endPoint.y),
	}

	return {
		selectedIds,
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
			'data-selectable-id': id,
		}),
	}
}
