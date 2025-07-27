import clsx from 'clsx'

export function GameState({
	isEnemyStep,
	selectedCount,
	className,
}: {
	isEnemyStep: boolean
	selectedCount: number
	className?: string
}) {
	return (
		<div
			className={clsx(
				'p-5 rounded-2xl text-[#e8e8e8] min-w-[130px] text-center',
				className,
				selectedCount > 0
					? 'bg-[#3e3e3e]'
					: isEnemyStep
					? 'bg-[#E59696]'
					: 'bg-[#58BF5F]'
			)}
		>
			{selectedCount > 0
				? 'Выбрано ' + selectedCount
				: isEnemyStep
				? 'Ход противника'
				: 'Ваш ход'}
		</div>
	)
}
