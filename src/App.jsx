import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import LandingPage from './Components/Landing page/LandingPage';
import Details from './Components/DETAILS/Details';
import Author from './Components/AUTHOR/Author';

import Politics from './Components/POLITICS/Politics';
import Opinion from './Components/OPINION/Opinion';
import Culture from './Components/CULTURE/Culture';
import MULTIMEDIA from './Components/MULTIMEDIA/multmedia';
import Interviews from './Components/INTERVIEWS/Interviews';

import postsData from './Components/Header Section/FiltetredPosts'
import './App.css'

function App() {

  return (
    <>
     <BrowserRouter basename="/Geeska-com">
        <Routes>
        <Route path="/" element={<LandingPage  posts={postsData}/>} />
        <Route path='/detail/:slug'  element={<Details />}></Route>
        <Route path='/author/:slug'  element={<Author />}></Route>

        <Route path='/politics'  element={<Politics />}></Route>
        <Route path='/opinion'  element={<Opinion />}></Route>
        <Route path='/culture'  element={<Culture />}></Route>
        <Route path='/multimedia'  element={<MULTIMEDIA />}></Route>
        <Route path='/interviews'  element={<Interviews />}></Route>
        
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
