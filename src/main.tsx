// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { BrowserRouter, Routes, Route } from 'react-router'
// import { TestPage } from './pages/test-page'
// import { MainMenuPage } from './pages/main-menu/fasade/main-menu-page'
// import { PresettingsPage } from './pages/presettings/fasade/presittings-page'

// createRoot(document.getElementById('root')!).render(
// 	<StrictMode>
// 		<BrowserRouter>
// 			<Routes>
// 				<Route path='/' element={<MainMenuPage />} />
// 				<Route path='/test' element={<TestPage />} />
// 				<Route path='/preset' element={<PresettingsPage />} />
// 			</Routes>
// 		</BrowserRouter>
// 	</StrictMode>
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { TestPage } from './pages/test-page'
import { MainMenuPage } from './pages/main-menu/fasade/main-menu-page'
import { PresettingsPage } from './pages/presettings/fasade/presittings-page'

const pageVariants = {
	initial: {
		opacity: 0,
	},
	in: {
		opacity: 1,
	},
	out: {
		opacity: 0,
	},
}

const pageTransition: Transition = {
	type: 'tween',
	ease: 'anticipate',
	duration: 0.25,
}

const AnimatedRoutes = () => {
	const location = useLocation()

	return (
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				<Route
					path='/'
					element={
						<motion.div
							initial='initial'
							animate='in'
							exit='out'
							variants={pageVariants}
							transition={pageTransition}
						>
							<MainMenuPage />
						</motion.div>
					}
				/>
				<Route
					path='/test'
					element={
						<motion.div
							initial='initial'
							animate='in'
							exit='out'
							variants={pageVariants}
							transition={pageTransition}
						>
							<TestPage />
						</motion.div>
					}
				/>
				<Route
					path='/preset'
					element={
						<motion.div
							initial='initial'
							animate='in'
							exit='out'
							variants={pageVariants}
							transition={pageTransition}
						>
							<PresettingsPage />
						</motion.div>
					}
				/>
			</Routes>
		</AnimatePresence>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<div className='relative w-full min-h-screen bg-[#e8e8e8]'>
				<AnimatedRoutes />
			</div>
		</BrowserRouter>
	</StrictMode>
)
