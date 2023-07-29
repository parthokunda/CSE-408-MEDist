import NavBar from "./components/NavBar";
import { navIcon } from "./models/navIcon";

const navList: navIcon[] = [
  { name: "Account", link: "/account" },
  { name: "Logout", link: "/logout" },
];

function App() {
  return (
    <>
      <NavBar navList={navList} />
    </>
  );
}

export default App;
