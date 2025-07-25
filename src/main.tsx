import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { TestPage } from './pages/test-page'
import { MainMenuPage } from './pages/main-menu/fasade/main-menu-page'
import { PresettingsPage } from './pages/presettings/fasade/presittings-page'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainMenuPage />} />
				<Route path='/test' element={<TestPage />} />
				<Route path='/preset' element={<PresettingsPage />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
