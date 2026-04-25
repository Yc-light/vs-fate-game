import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import ClassSelectPage from './pages/ClassSelectPage'
import DifficultySelectPage from './pages/DifficultySelectPage'
import GamePage from './pages/GamePage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/class-select" element={<ClassSelectPage />} />
        <Route path="/difficulty-select" element={<DifficultySelectPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
