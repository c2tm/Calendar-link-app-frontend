import { forwardRef } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import "../styles/NavMenu.css";

const NavMenu = forwardRef(({setIsAuthorized}, ref) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthorized(false);
        window.location = "login";
    }

    return <div ref={ref} className="nav-menu">
        <a href="#" onClick={() => navigate('/')}>Home</a>
        <a href="#" onClick={() => navigate('/edit_account')}>Manage Account</a>
        <a href="#" onClick={() => handleLogout()}>Log out</a>
    </div>
});

export default NavMenu;