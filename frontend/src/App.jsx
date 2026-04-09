import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProfilPage from './pages/ProfilPage'
import LettresPage from './pages/LettresPage'
import LettreDetailPage from './pages/LettreDetailPage'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/profils" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
        <Route path="/lettres" element={<PrivateRoute><LettresPage /></PrivateRoute>} />
        <Route path="/lettres/:id" element={<PrivateRoute><LettreDetailPage /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
