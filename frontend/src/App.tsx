import NavBar from "./components/customUI/NavBar";
import { navIcon } from "./models/navIcon";
import MedicineDescriptionPage from "./pages/Medicines/MedicineDescriptionPage";
import MedicineSearchPage from "./pages/Medicines/MedicineSearchPage";
import SearchMed from "./pages/Medicines/SearchMed";
import GenericList from "./pages/Medicines/generics";

const genericList = [
  {
    id: 2,
    name: "Generic 2",
    description: "Generic 12 description",
    type: "Generic",
    availableBrands: 12,
  },
  {
    id: 1,
    name: "Generic 1",
    description: "Generic 1 description",
    type: "Generic",
    availableBrands: 22,
  },
  {
    id: 3,
    name: "Generic 3",
    description: "Generic 3 description",
    type: "Generic",
    availableBrands: 32,
  }];

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
      <SearchMed />
      <GenericList genericList={genericList} />
    </>
  );
}

export default App;
