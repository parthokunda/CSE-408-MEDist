import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { FC } from "react";
import { Link } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { navIcon } from "../../models/navIcon";

const NavBar: FC<{ navList: navIcon[] }> = (props) => {
  return (
    <>
      <NavigationMenu>
        <div className="flex items-center w-screen h-14 bg-c1 font-inter ">
          <div className="font-bold text-3xl text-c4 ml-4 flex-grow">
            <Link to="/">MEDist</Link>
          </div>
          <NavigationMenuList className="flex px-4 gap-4">
            {props.navList.map((icon) => (
              <NavigationMenuItem
                key={icon.name}
                className="text-c4 hover:text-white"
              >
                {icon.link === "/appointments" && icon.role === "doctor" ? (
                  <Link to="/doctor/pendingAppointments">{icon.name}</Link>
                ) : icon.link === "/appointments" && icon.role === "patient" ? (
                  <Link to="/patient/searchDoctor/">{icon.name}</Link>
                ) : (
                  <NavigationMenuLink href={icon.link ? icon.link : ""}>
                    {icon.name}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </div>
      </NavigationMenu>
      <Outlet />
    </>
  );
};

export default NavBar;
