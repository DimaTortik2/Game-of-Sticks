import { useMousePosition } from '../../model/hooks/use-mouse-position'
import { MouseAlert } from './mouse-alert'

interface IProps {
	isVisible: boolean
	text: string
}

export function MouseFollowerAlert({ isVisible, text }: IProps) {
	const mousePosition = useMousePosition()

	return (
		<MouseAlert
			text={text}
			isVisible={isVisible}
			left={mousePosition.x}
			top={mousePosition.y}
		/>
	)
}
