import { BasicModal } from '../../shared/ui/modal/basic-modal'

export function AboutModal({
	isVisible,
	onClose,
}: {
	isVisible: boolean
	onClose: () => void
}) {
	return (
		<BasicModal
			isVisible={isVisible}
			onClose={onClose}
			className='w-[95vw] max-w-[1000px]'
		>
			<div className='absolute top-0 left-0 w-16 h-12 bg-[#d3d3d350] [clip-path:polygon(0_0,100%_0,0_100%)] rounded-tl-2xl' />
			<div className='absolute bottom-0 right-0 w-20 h-20 bg-[#d3d3d350] [clip-path:polygon(100%_100%,0_100%,100%_0)] rounded-br-2xl' />

			<div className='flex flex-col items-center justify-center p-5 gap-5'>
				<p className='text-[#E8E8E8] text-xl leading-8'>
					<p className='font-semibold text-2xl mb-3'>
						Спасибо, что посетили сайт!
					</p>
					Этот проект был создан за неделю с небольшим и до сих пор развивается!{' '}
					<p>
						Создавался он как критически важная помощь другу при поступлении в
						группу для программистов в его новом универстиете. Теперь это мой
						pet-проект )
					</p>
					<p>
						Следующим шагом разработки будет внедрение адаптивности под
						мобильные устройства.
					</p>
					<a
						target='_blank'
						href='https://github.com/DimaTortik2/Game-of-Sticks'
					>
						<div className='mt-6 py-2 px-3 bg-[#e8e8e8] rounded-2xl text-[#212121] inline-block transition-all transform hover:scale-105 hover:bg-[#ffffff]'>
							Github проекта
						</div>
					</a>
				</p>
				<p className='text-[#E8E8E850]'>- Создатель</p>
			</div>
		</BasicModal>
	)
}
