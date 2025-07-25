export const makeHandleSliderChange = ({
	setSliderState,
	setSliderRangeState,
}: {
	setSliderState?: React.Dispatch<React.SetStateAction<number>>
	setSliderRangeState?: React.Dispatch<React.SetStateAction<number[]>>
}) => {
	return (_: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number' && setSliderState) {
			setSliderState(newValue)
			return
		}
		if (Array.isArray(newValue) && setSliderRangeState) {
			const [left, right] = newValue

			if (left < right) setSliderRangeState(newValue)
		}
	}
}
