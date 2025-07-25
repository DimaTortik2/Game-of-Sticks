import Slider  from '@mui/material/Slider'
import { styled } from '@mui/material/styles'

export const PresettingSlider = styled(Slider)({
	color: '#687382',
	height: 8,
	'& .MuiSlider-track': {
		border: 'none',
	},
	'& .MuiSlider-valueLabel': {
		lineHeight: 1.2,
		fontSize: 12,
		background: 'unset',
		padding: 0,
		width: 32,
		height: 32,
		borderRadius: '50% 50% 50% 0',
		backgroundColor: '#687382',
		transformOrigin: 'bottom left',
		transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
		'&::before': { display: 'none' },
		'&.MuiSlider-valueLabelOpen': {
			transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
		},
		'& > *': {
			transform: 'rotate(45deg)',
		},
	},
})
