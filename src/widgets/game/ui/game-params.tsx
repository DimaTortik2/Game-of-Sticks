import clsx from 'clsx'
import type { IGameParams } from '../../../app/stores/interfaces/game-params.interface'

export function GameParams({
	gameParams,
	modeNum,
	className,
}: {
	gameParams: IGameParams
	modeNum: number
	className?: string
}) {
	const RenderParam = ({
		title,
		max,
		range,
	}: {
		title: string
		max?: number
		range?: number[]
	}) => {
		return (
			<div
				className={clsx(
					'rounded-2xl bg-[#3d3d3d] flex gap-4 p-5 items-center text-[#e8e8e8]',
					className
				)}
			>
				<p>{title}</p>
				{max && (
					<div className=' h-[2.25rem] w-[2.25rem] flex justify-center items-center '>
						{max}
					</div>
				)}
				{range && (
					<div className='flex gap-3 h-full items-center'>
						<div className='gap-3  flex justify-center items-center '>
							<p> От</p> {range[0]}
						</div>

						<div className=' gap-3  flex justify-center items-center '>
							<p>До</p> {range[1]}
						</div>
					</div>
				)}
			</div>
		)
	}

	switch (modeNum) {
		case 1:
			return <RenderParam title='Макс. за ход' max={gameParams.maxPerStep} />
		case 2:
			return (
				<RenderParam title='Палочек за ход' range={gameParams.sticksRange} />
			)

		case 3:
			return (
				<RenderParam
					title='Макс. за ход подряд'
					max={gameParams.maxPerStepStreak}
				/>
			)

		case 4:
			return (
				<RenderParam
					title='Палочек за ход подряд'
					range={gameParams.sticksRangeStreak}
				/>
			)

		default:
			return <></>
	}
}
