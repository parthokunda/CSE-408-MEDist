import { ProfileStatus } from "@/models/LoginSignUpSchema";
import AppointmentPage from "@/pages/patient/Appointment/AppointmentPage";
import BookAppointment from "@/pages/patient/BookAppointment/PatientBookAppointment";
import PatientInfo from "@/pages/patient/PatientInfo";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Route, Routes } from "react-router-dom";



const PatientRouter: FC = () => {
  const [cookies] = useCookies(["user"]);
  if (cookies.user && cookies.user.role && cookies.user.role == "patient") {
    if (cookies.user.profile_status === ProfileStatus.PARTIALLY_REGISTERED) {
      <Navigate to="/patient/account" />;
    }
    return (
      <Routes>
        <Route>
          <Route path="/" element={<PatientInfo />} />
          <Route path="/account" element={<PatientInfo />} />
          <Route path="/searchDoctor" element={<AppointmentPage />} />
          <Route path="/bookAppointment/:doctorID" element={<BookAppointment />}
          />
        </Route>
      </Routes>
    );
  }
  return <Navigate to="/" />;
};

export default PatientRouter;
