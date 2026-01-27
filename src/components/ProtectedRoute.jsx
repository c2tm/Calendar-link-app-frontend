import { useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import {Navigate} from "react-router-dom";
import api from "../api";

function ProtectedRoute({children, isAuthorized, setIsAuthorized, userInfo, setUserInfo}) {

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    },[])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            const res = await api.post("/api/token/refresh/", {refresh: refreshToken});
            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
                const decoded = jwtDecode(res.data.access);
                if(!userInfo) {
                    getUserInfo(decoded.user_id);
                }
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error(error.code, error)
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
            if(!userInfo) {
                getUserInfo(decoded.user_id);
            }
        }
    }

    async function getUserInfo(userId) {
        try {
            const response = await api.get(`/api/getOrUpdateUser/${userId}/`);
            setUserInfo(response.data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    }

    if(isAuthorized === null) {
        return <div>
            Loading...
        </div>
    } else {
        return isAuthorized ? children : <Navigate to="/login" />
    }
}

export default ProtectedRoute;