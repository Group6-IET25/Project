import './App.css'
import ProtectedRoute from './Auth/ProtectedRoute'
import AuthCard from './pages/AuthCard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserDashboard from './pages/userDashboard'
import HospitalDashboard from './pages/HospitalDashboard'


function App() {

  return (
    <>
       <BrowserRouter>
          <Routes>
             <Route path='/' element = {<AuthCard/>}/>

             {/* <Route element={<ProtectedRoute/>}> */}
                {/* <Route path='/home' element={<HospitalDashboard/>}/> */}
                <Route path='/home' element={<UserDashboard/>}/>

                <Route path='/share/' element={"hello"}/>
              {/* </Route> */}
          </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
