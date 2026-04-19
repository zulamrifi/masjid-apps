import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useEffect } from 'react'
import { getMosqueInfo } from './lib/firebase'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import './styles/global.css'

// Load tema dari Firebase saat app pertama dibuka
function ThemeLoader() {
  useEffect(() => {
    getMosqueInfo().then(data => {
      if (data?.tema) document.documentElement.setAttribute('data-theme', data.tema)
    }).catch(() => {})
  }, [])
  return null
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="loader"/></div>
  return user ? children : <Navigate to="/login" replace/>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeLoader/>
        <Toaster position="top-center" toastOptions={{
          style:{ background:'#1a2e1a', color:'#e8d5a3', border:'1px solid rgba(201,168,76,0.3)' },
          success:{ iconTheme:{ primary:'#4ade80', secondary:'#0d1f0d' } },
        }}/>
        <Routes>
          <Route path="/"        element={<LandingPage/>}/>
          <Route path="/login"   element={<LoginPage/>}/>
          <Route path="/admin/*" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
