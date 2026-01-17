import UserForm from "../components/UserForm";

const Login = ({setUserInfo, setIsAuthorized}) => {
    return <UserForm route="/api/token/" mode="login" setUserInfo={setUserInfo} setIsAuthorized={setIsAuthorized}/>
}

export default Login;