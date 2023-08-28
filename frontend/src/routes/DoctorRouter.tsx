import { ProfileStatus } from "@/models/LoginSignUpSchema";
import AddSchedule from "@/pages/doctor/AddSchedule";
import DoctorInfo from "@/pages/doctor/DoctorInfo";
import PatientSearchPage from "@/pages/doctor/DoctorPendingAppointments";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Route, Routes } from "react-router-dom";

const DoctorRouter: FC = () => {
  const [cookies] = useCookies(["user"]);
  if (cookies.user && cookies.user.role && cookies.user.role == "doctor") {
    if (cookies.user.profile_status === ProfileStatus.PARTIALLY_REGISTERED) {
      <Navigate to="/doctor/account" />;
    }
    return (
      <Routes>
        <Route>
          <Route path="/" element={<DoctorInfo />} />
          <Route path="/account" element={<DoctorInfo />} />
          <Route path="/addSchedule" element={<AddSchedule />} />
          <Route path="/pendingAppointments" element={<PatientSearchPage />} />
        </Route>
      </Routes>
    );
  }
  return <Navigate to="/" />;
};

export default DoctorRouter;
