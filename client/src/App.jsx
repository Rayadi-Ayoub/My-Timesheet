import React from 'react'
import {BrowserRouter , Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Pole from './pages/Pole';
import Campany from './pages/Company';
import Projects from './pages/Projects';
import Home from './pages/Home';
import Header from './components/Header';

export default function App() {

  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home/>}/> 
        <Route path='/About' element={<About/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='Register' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/pole' element={<Pole/>}/>
        <Route path='/campany' element={<Campany/>}/> 
        <Route path='/projects' element={<Projects/>}/>
      </Routes>
    </BrowserRouter>
  )
}
