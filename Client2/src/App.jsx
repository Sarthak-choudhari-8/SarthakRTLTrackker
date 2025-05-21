import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from "./pages/Home"
import Todo from "./pages/Todo"
import Finance from "./pages/Finance"
import Photo from "./pages/Photo"
import Secure from "./pages/Secure"
import ToWatch from "./pages/ToWatch"


function App() {
  

  return (
    <>
<Router>

<Routes>
<Route path='/' element={<Home />} />
<Route path='/home' element={<Home />} />
<Route path='/finance' element={<Finance />} />
<Route path='/photo' element={<Photo />} />
<Route path='/secure' element={<Secure />} />
<Route path='/todo' element={<Todo />} />
<Route path='/towatch' element={<ToWatch />} />

</Routes>

</Router>
    </>
  )
}

export default App
