import NavBar from "@/components/customUI/NavBar";
import { ProfileStatus } from "@/models/LoginSignUpSchema";
import { navIcon } from "@/models/navIcon";
import AppointmentPage from "@/pages/patient/Appointment/AppointmentPage";
import DoctorSearchPage from "@/pages/patient/DoctorSearchPage";
import PatientInfo from "@/pages/patient/PatientInfo";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Route, Routes } from "react-router-dom";

const navList: navIcon[] = [
  { name: "Medicines", link: "/searchMedicines" },
  { name: "Prescriptions", link: "/prescriptions" },
  { name: "Appointments", link: "/appointments", role: "patient" },
  { name: "Account", link: "/patient/account" },
  { name: "Logout", link: "/logout/" }, //! careful with the first /. cookies path problem otherwise
  // TODO: add a logout icon insted of this
];

const PatientRouter: FC = () => {
  const [cookies] = useCookies(["user"]);
  if (cookies.user && cookies.user.role && cookies.user.role == "patient") {
    if (cookies.user.profile_status === ProfileStatus.PARTIALLY_REGISTERED) {
      <Navigate to="/patient/account" />;
    }
    return (
      <Routes>
        <Route >
          <Route path="/" element={<PatientInfo />} />
          <Route path="/account" element={<PatientInfo />} />
          <Route path="/searchDoctor" element={<AppointmentPage/>} />
        </Route>
      </Routes>
    );
  }
  return <Navigate to="/" />;
};

export default PatientRouter;
