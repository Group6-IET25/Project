import './App.css'
import AuthCard from './pages/AuthCard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

import HospitalDashboard from './pages/HospitalDashboard'
import UserDashboard from './pages/UserDashboard'
import Home from './pages/Home'
import LiveUser from './lib/liveUser'
import Tracking from './lib/tracking'
import Patients from './lib/patients'
import ProtectedRoute from './Auth/ProtectedRoute'


function App() {

 //console.log("hi", import.meta.env.VITE_API_URL)

  return (
    <>
       <BrowserRouter>
       <Toaster richColors/>
          <Routes>
             <Route path='/home' element = {<AuthCard/>}/>
             <Route path='/' element = {<Home/>}/>

             <Route element={<ProtectedRoute/>}>
                
                <Route path='/hospitaldashboard' element={<HospitalDashboard/>}>
                     <Route index element={<LiveUser/>} />
                     <Route path='trackingPatients' element={<Tracking/>}/>
                     <Route path='confirmPatients' element={<Patients/>}/>
                </Route>
                <Route path='/userdashboard' element={<UserDashboard/>}/>

                <Route path='/share/' element={"hello"}/>
             </Route>
          </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
