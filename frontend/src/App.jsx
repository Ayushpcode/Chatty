import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import { axiosInstance } from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader} from "lucide-react"
import { useEffect } from 'react'
import {Toaster} from "react-hot-toast"
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


function App() {
  const {authUser,checkAuth,isCheckingAuth, onlineUsers} = useAuthStore()
  const {theme} =  useThemeStore();

  console.log({onlineUsers});
  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className="flex justify-center items-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
  
  
  return (
    <div data-theme={theme}>
    <Navbar/>
    <Routes>
      <Route path="/" element= { authUser ? <HomePage  /> : <Navigate to="/login"/>} />
      <Route path="/sign-up" element={ !authUser ?<SignUpPage /> : <Navigate to="/"/>} />
      <Route path="/login" element={ !authUser ?<LoginPage /> : <Navigate to="/"/>} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
    </Routes>

    <Toaster />
    </div>
  )
}

export default App
