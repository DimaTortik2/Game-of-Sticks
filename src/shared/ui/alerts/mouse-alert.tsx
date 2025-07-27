export function MouseAlert({
	isVisible,
	left,
	top,
	text,
}: {
	isVisible: boolean
	left: number
	top: number
	text: string
}) {
	return (
		<>
			{isVisible && (
				<div
					style={{
						position: 'fixed',
						left,
						top,
						transform: 'translate(10px, 10px)',
					}}
					className='z-50 p-3 bg-[#212121] text-[#e8e8e8] rounded-md pointer-events-none'
				>
					{text}
				</div>
			)}
		</>
	)
}
