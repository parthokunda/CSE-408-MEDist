import {FC} from 'react';
import {useCookies} from 'react-cookie'
import { Navigate } from 'react-router-dom';

const PatientRoute : FC<{element:JSX.Element}> = (props) : JSX.Element => {
    const [cookies] = useCookies(["user"]);
    if(cookies.user && cookies.user.role && cookies.user.role == 'patient'){
        return props.element;
    }
    return <Navigate to="/" />
};

export default PatientRoute;