import Navbar from './components/Navbar'
import './index.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
