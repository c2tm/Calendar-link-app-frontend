import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import EditAccount from './pages/EditAccount';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NavMenu from './components/NavMenu';
import WhopRedirect from './pages/WhopRedirect';
import api from './api';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import NavMenuMobile from './components/NavMenuMobile';

function App() {

  const [isAuthorized, setIsAuthorized] = useState(null)
  const [userInfo, setUserInfo] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const checkViewport = (showMenu, setShowMenu) => {
    if(window.innerWidth < 768) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setShowMenu(!showMenu);
    }
  }

  return (
    <div className='app-container'>
      <header>
        <nav className='navbar'>
          <a href="#" onClick={() => navigate('/')}>Event Link Creator</a>
          {isAuthorized && <button onClick={()=>checkViewport(showMenu, setShowMenu)}><FontAwesomeIcon icon={faGear} /></button>}
        </nav>
      </header>

      {showMenu && <NavMenu setIsAuthorized={setIsAuthorized}/>}
      <NavMenuMobile
        setIsAuthorized={setIsAuthorized}
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
      />

      <Routes>
        <Route path="/" element={
          <ProtectedRoute isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} userInfo={userInfo} setUserInfo={setUserInfo}>
            <Home/>
          </ProtectedRoute>
        }/>

        <Route path="/edit_account" element={
          <ProtectedRoute isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} setUserInfo={setUserInfo}>
            <EditAccount userInfo={userInfo} setUserInfo={setUserInfo}/>
          </ProtectedRoute>
        }/>
        
        {/* <Route path="/whop_redirect" element={
          <ProtectedRoute isAuthorized={isAuthorized} setIsAuthorized={setIsAuthorized} setUserInfo={setUserInfo}>
            <WhopRedirect/>
          </ProtectedRoute>
        }/> */}

        <Route path="/login" element={
          <Login setUserInfo={setUserInfo} setIsAuthorized={setIsAuthorized}/>
        }/>


        <Route path="/register" element={
          <Register />
        }/>
      </Routes>
    </div>
  )
}

export default App