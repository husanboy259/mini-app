import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { SavatPage } from './pages/SavatPage'
import { XizmatlarPage } from './pages/XizmatlarPage'
import { BuyurtmalarimPage } from './pages/BuyurtmalarimPage'
import { FastFoodMenu } from './games/menu/FastFoodMenu'
import { AdminPanel } from './games/menu/AdminPanel'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/katalog" element={<FastFoodMenu />} />
        <Route path="/menu" element={<FastFoodMenu />} />
        <Route path="/savat" element={<SavatPage />} />
        <Route path="/xizmatlar" element={<XizmatlarPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/buyurtmalarim" element={<BuyurtmalarimPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  )
}

export default App
