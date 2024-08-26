import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import LandingPage from './Components/Landing page/LandingPage';
import Details from './Components/DETAILS/Details';
import Author from './Components/AUTHOR/Author';

import postsData from './Components/Header Section/FiltetredPosts'
import './App.css'

function App() {

  return (
    <>
     <BrowserRouter basename="/Geeska-com">
        <Routes>
        <Route path="/" element={<LandingPage  posts={postsData}/>} />
        <Route path='/detail/:slug'  element={<Details />}></Route>
        <Route path='/author/:slug'  element={<Details />}></Route>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
