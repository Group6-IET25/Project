import './App.css'
import ProtectedRoute from './Auth/ProtectedRoute'
import AuthCard from './pages/AuthCard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

import HospitalDashboard from './pages/HospitalDashboard'
import UserDashboard from './pages/UserDashboard'


function App() {

  return (
    <>
       <BrowserRouter>
       <Toaster richColors/>
          <Routes>
             <Route path='/home' element = {<AuthCard/>}/>

             {/* <Route element={<ProtectedRoute/>}> */}
                <Route path='/hospitaldashboard' element={<HospitalDashboard/>}/>
                <Route path='/userdashboard' element={<UserDashboard/>}/>

                <Route path='/share/' element={"hello"}/>
             {/* </Route> */}
          </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
