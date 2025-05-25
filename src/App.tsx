
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
