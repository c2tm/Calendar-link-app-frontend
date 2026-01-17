import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import "../styles/NavMenu.css";

const NavMenu = ({setIsAuthorized}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthorized(false);
        window.location = "login";
    }

    return <div className="nav-menu">
        <a href="#" onClick={() => navigate('/edit_account')}>Manage Account</a>
        <a href="#" onClick={() => handleLogout()}>Log out</a>
    </div>
}

export default NavMenu;