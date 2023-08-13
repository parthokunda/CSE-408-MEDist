import NavBar from "@/components/customUI/NavBar";
import { navIcon } from "@/models/navIcon";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import GenericDescriptionPage from "@/pages/Medicines/Generic/GenericDescriptionPage";
import ManufacturerDescriptionPage from "@/pages/Medicines/Manufacturer/ManufacturerPage";
import MedicineDescriptionPage from "@/pages/Medicines/Medicine/MedicineDescriptionPage";
import MedicineSearchPage from "@/pages/Medicines/SearchMedicines/MedicineSearchPage";
import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PatientRoute from "./PatientRouter";

const navList: navIcon[] = [
  { name: "Medicines", link: "/medicines" },
  { name: "Prescriptions", link: "/prescriptions" },
  { name: "Appointments", link: "/appointments" },
  { name: "Account", link: "/account" },
  { name: "Logout", link: "/logout" }, // TODO: add a logout icon insted of this
];

const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/searchMedicines/" replace />} />
      <Route element={<NavBar navList={navList} />}>
        <Route path="searchMedicines/" element={<MedicineSearchPage />} />
        <Route
          path="medicine/:medicineId"
          element={<MedicineDescriptionPage />}
        />
        <Route path="generic/:genericId" element={<GenericDescriptionPage />} />
        <Route
          path="manufacturer/:manufacturerId"
          element={<ManufacturerDescriptionPage />}
        />
        <Route path="/patient" element={<PatientRoute element={<>HELLO</>}/>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
