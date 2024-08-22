import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import LandingPage from './Components/Landing page/LandingPage';
import postsData from './Components/Header Section/FiltetredPosts'
import './App.css'

function App() {

  return (
    <>
     <BrowserRouter basename="/Geeska-com">
        <Routes>
        <Route path="/" element={<LandingPage  posts={postsData}/>} />
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
