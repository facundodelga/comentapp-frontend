import Navbar from './components/Navbar'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
    <AuthProvider>
      <Navbar />
      <Outlet />
    </AuthProvider>
      
    </>
  )
}

export default App
