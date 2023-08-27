import NavBar from "@/components/customUI/NavBar";
import { navIcon } from "@/models/navIcon";
import Logout from "@/pages/LoginPage/Logout";
import GenericDescriptionPage from "@/pages/Medicines/Generic/GenericDescriptionPage";
import ManufacturerDescriptionPage from "@/pages/Medicines/Manufacturer/ManufacturerPage";
import MedicineDescriptionPage from "@/pages/Medicines/Medicine/MedicineDescriptionPage";
import MedicineSearchPage from "@/pages/Medicines/SearchMedicines/MedicineSearchPage";
import AddSchedule from "@/pages/doctor/AddSchedule";
import DoctorInfo from "@/pages/doctor/DoctorInfo";
import PatientSearchPage from "@/pages/doctor/DoctorPendingAppointments";
import BookAppointment from "@/pages/patient/BookAppointment/PatientBookAppointment";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRouter";
import PatientRouter from "./PatientRouter";

const AppRouter: FC = () => {
  const [cookies] = useCookies(["user"]);
  const role =
    cookies.user === undefined
      ? "none"
      : cookies.user.role === "doctor"
      ? "doctor"
      : "patient";
      const navList: navIcon[] = [
        { name: "Medicines", link: "/searchMedicines" },
        { name: "Prescriptions", link: "/prescriptions" },
        { name: "Appointments", link: "/appointments", role: role },
        { name: "Account", link: "/account", role: role },
        { name: "Logout", link: "/logout/" }, //! careful with the first /. cookies path problem otherwise
        // TODO: add a logout icon insted of this
      ];

  return (
    <Routes>
      <Route path="/" element={<AuthRoute />} />
      <Route element={<NavBar navList={navList} />}>
        <Route path="/searchMedicines/" element={<MedicineSearchPage />} />
        <Route
          path="/medicine/:medicineId"
          element={<MedicineDescriptionPage />}
        />
        <Route
          path="/generic/:genericId"
          element={<GenericDescriptionPage />}
        />
        <Route
          path="/manufacturer/:manufacturerId"
          element={<ManufacturerDescriptionPage />}
        />
        <Route path="/doctor/info/" element={<DoctorInfo />} />
        <Route path="doctor/addSchedule" element={<AddSchedule />} />
        <Route
          path="doctor/pendingAppointments"
          element={<PatientSearchPage />}
        />
        <Route
          path="patient/bookAppointment/:doctorID"
          element={<BookAppointment />}
        />
        {/* <Route path="patient/searchDoctor" element={<DoctorSearchPage />} /> */}
        <Route path="/patient/*" element={<PatientRouter />} />
      </Route>
      <Route path="/logout/" element={<Logout />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
