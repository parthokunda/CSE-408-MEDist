import { ProfileStatus } from "@/models/LoginSignUpSchema";
import DoctorAppointments from "@/pages/doctor/DoctorAppointments";
import DoctorInfo from "@/pages/doctor/DoctorInfo";
import DoctorEditPrescription from "@/pages/doctor/Prescription/DoctorEditPrescription";
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
          <Route path="/appointments" element={<DoctorAppointments />} />
          <Route path="/prescription/:prescriptionId" element={<DoctorEditPrescription />} />
          {/* <Route path="/prescription/:prescriptionId/download" element={<DownlaodPrescription/>} /> */}
        </Route>
      </Routes>
    );
  }
  return <Navigate to="/" />;
};

export default DoctorRouter;
