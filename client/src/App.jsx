import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext.jsx'
const App = () => {
  const {authUser} = useContext(AuthContext);
  return (
    //<div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
    <div className="min-h-screen overflow-x-hidden bg-cover bg-no-repeat bg-center bg-[url('/bgImage.svg')]">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage/>:<Navigate to="/login" />}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path='/profile' element={authUser ? <ProfilePage/>:<Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App
