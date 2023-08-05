import NavBar from "./components/customUI/NavBar";
import { navIcon } from "./models/navIcon";
import MedicineSearchPage from "./pages/Medicines/MedicineSearchPage";

const navList: navIcon[] = [
  { name: "Medicines", link: "/medicines" },
  { name: "Prescriptions", link: "/prescriptions" },
  { name: "Appointments", link: "/appointments" },
  { name: "Account", link: "/account" },
  { name: "Logout", link: "/logout" }, // TODO: add a logout icon insted of this
];

function App() {
  return (
    <>
      <NavBar navList={navList} />
      <MedicineSearchPage />
    </>
  );
}

export default App;