import { Brand } from "@/models/Brand";
import { FC } from "react";
import { useState } from "react";
import MedCard from "./MedCard";

// import 'bootstrap/dist/css/bootstrap.min.css';

const MedCards: FC<{ medicineList: Brand[] }> = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const lastIndex= currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = props.medicineList.slice(firstIndex, lastIndex);
    const nPages = Math.ceil(props.medicineList.length / recordsPerPage);
    const pages = [...Array(nPages).keys()].map((i) => i + 1);

    return (
      <div >
        <div className="flex flex-wrap">
        {records.map((medicine) => (
          <MedCard medicine={medicine}/>
        ))}
        </div>
        <nav>
            <ul className="flex">
                <li className="ml-2 mr-4 hover:text-c2">
                    <a className="page-link" href="#" onClick={prevPage}>Previous</a>
                </li>{
                    pages.map((page) => 
                        <li className={page===currentPage?"text-c1 font-bold mr-4 hover:text-c2 ": "mr-4 hover:text-c2 "}>
                            <a className="page-link" href="#" onClick={() => setPage(page)}>{page}</a>
                        </li>
                    )
                    
                }
                <li className="mr-4 hover:text-c2">
                    <a className="page-link" href="#" onClick={nextPage}>Next</a>
                </li>
            </ul>
        </nav>
      </div>
      
    )
    function setPage(page: number) {
        setCurrentPage(page);
    }
    function nextPage() {
        if (currentPage < nPages) {
            setCurrentPage(currentPage + 1);
        }
    }
    function prevPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    ;
  };
  
  export default MedCards;