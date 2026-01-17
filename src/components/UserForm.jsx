import { useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/UserForm.css";

const UserForm = ({route, mode, setUserInfo=null, setIsAuthorized=null}) => {
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(mode === "register") {
            if(password1 !== password2) {
                alert("Passwords do not match!");
                return
            }
        }

        try {
            const body = {
                username: email,
                password: password1
            }

            if (mode === "register") body.email = email;

            const res = await api.post(route, body)
            console.log(res);
            if(mode === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                setUserInfo({
                    id: res.data.user_id,
                    email: res.data.email,
                    username: res.data.username
                })
                if(setIsAuthorized) setIsAuthorized(true);
                navigate("/")
            } else {
                navigate("/login")
            }

        } catch (err) {
            alert(err);
        }
    }

    const handleSwitchMode = () => {
        mode === "login" ? navigate("/register") : navigate("/login");
    }

    return <form className="user-form" onSubmit={handleSubmit}>
        <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
        <input type="text" name="password1" id="password1" onChange={(e) => setPassword1(e.target.value)} placeholder="Password" required/>
        {mode === "register" && <input type="text" name="password2" id="password2" onChange={(e) => setPassword2(e.target.value)} placeholder="Confirm Password" required/>}
        <div className="button-container">
            <button type="submit">{mode === "login" ? "Log In" : "Create Account"}</button>
            <button  type="button" onClick={handleSwitchMode}>{mode === "login" ? "Create Account" : "Back"}</button>
        </div>
    </form>
}
    
export default UserForm;