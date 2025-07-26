import { PressetingFormMode1 } from '../fasade/presseting-form-mode-1'
import { PressetingFormMode2 } from '../fasade/presseting-form-mode-2'
import { PressetingFormMode3 } from '../fasade/presseting-form-mode-3'
import { PressetingFormMode4 } from '../fasade/presseting-form-mode-4'
import { PressetingFormMode5 } from '../fasade/presseting-form-mode-5'

export function PresettingFromRender({ modeNum }: { modeNum: number }) {
	if (!modeNum) {
		return (
			<p className='p-5 rounded-2xl bg-red-400 text-[#e8e8e8] max-h-[4rem]'>
				Ошибка с выбором режима!
			</p>
		)
	}

	switch (modeNum) {
		case 1:
			return <PressetingFormMode1 />
		case 2:
			return <PressetingFormMode2 />
		case 3:
			return <PressetingFormMode3 />
		case 4:
			return <PressetingFormMode4 />
		case 5:
			return <PressetingFormMode5 />
	}
}
