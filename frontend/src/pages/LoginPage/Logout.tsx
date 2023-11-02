import {FC} from 'react';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

const Logout: FC = () => {
    const [cookie, removeCookie] = useCookies(["user"]);
    removeCookie("user", {path: "/"});
    console.log(cookie.user);
    return <Navigate to="/" replace/>
};

export default Logout;