import clsx from 'clsx'

export function PresettingPushBtn({
	title,
	onClick,
	isActive,
}: {
	title: string
	onClick: () => void
	isActive: boolean
}) {
	return (
		<div className=' flex gap-10 items-center'>
			<div className='flex flex-col'>
				<div
					className={clsx(
						'  text-[#e8e8e8] w-full max-w-md px-6 py-5  text-lg font-semibold shadow-lg flex items-center justify-center min-w-[350px] rounded-2xl transition-transform transform hover:scale-105 cursor-pointer',
						isActive ? 'bg-[#4B9E51]' : 'bg-[#3e3e3e]'
					)}
					onClick={onClick}
				>
					{title}
				</div>
			</div>

			<div className=' flex items-center text-[#212121]'></div>
		</div>
	)
}
