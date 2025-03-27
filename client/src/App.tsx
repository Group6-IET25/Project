import './App.css'
import ProtectedRoute from './Auth/ProtectedRoute'
import AuthCard from './pages/AuthCard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'



function App() {

  return (
    <>
       <BrowserRouter>
          <Routes>
             <Route path='/' element = {<AuthCard/>}/>

             
          </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
