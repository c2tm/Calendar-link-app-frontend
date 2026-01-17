import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "../styles/NavMenuMobile.css";

const NavMenuMobile = ({ setIsAuthorized, show, onHide }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthorized(false);
        onHide();
        window.location = "login";
    };

    const handleNavigate = (path) => {
        onHide();
        navigate(path);
    };

    return (
        <Modal show={show} onHide={onHide} className="nav-menu-mobile-modal">
            <Modal.Body>
                <div className="nav-menu-mobile-links">
                    <Button
                        variant="outline-light"
                        className="nav-menu-mobile-btn"
                        onClick={() => handleNavigate('/')}
                    >
                        Home
                    </Button>
                    <Button
                        variant="outline-light"
                        className="nav-menu-mobile-btn"
                        onClick={() => handleNavigate('/edit_account')}
                    >
                        Manage Account
                    </Button>
                    <Button
                        variant="outline-danger"
                        className="nav-menu-mobile-btn"
                        onClick={handleLogout}
                    >
                        Log out
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default NavMenuMobile;