import { LoginPage } from '@/pages/LoginPage/LoginPage';
import {FC} from 'react';
import {useCookies} from 'react-cookie'
import { Navigate } from 'react-router-dom';

const AuthRoute : FC = () : JSX.Element =>{
    const [cookies] = useCookies(["user"]);
    if(!cookies.user || !cookies.user.role)
        return <LoginPage/>
    
    if(cookies.user.role == 'patient'){
        return <Navigate to="/patient"/>
    }
    if(cookies.user.role == 'doctor'){
        return <Navigate to="/doctor"/>
    }
    return <>No router found</>
}

export default AuthRoute;