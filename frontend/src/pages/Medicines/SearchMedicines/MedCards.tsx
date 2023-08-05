import { BrandInfo } from "@/models/Brand";
import { FC } from "react";
import MedCard from "./MedCard";
import { useState } from "react";
import {AiOutlineArrowLeft} from "react-icons/ai";
import {AiOutlineArrowRight} from "react-icons/ai";
const MedCards: FC<{
  brandFetchedData: BrandInfo[];
}> = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 12;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = props.brandFetchedData.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(props.brandFetchedData.length / recordsPerPage);
  // const pages = [...Array(nPages).keys()].map((i) => i + 1);
  //3pages around currentPage
  // const threePages = (currentPage: number) => {
  //   if (currentPage === 1) {
  const array=[currentPage-2,currentPage-1,currentPage,currentPage+1,currentPage+2]
  const pages = array.filter((page) => page > 0 && page <= nPages);
  // const pages_3 = [...Array(3).keys()].map((i) => i + 1);
  if (props.brandFetchedData && props.brandFetchedData.length === 0) {
    return (
      <div className="flex justify-center align-middle">No Item Found</div>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap mt-3 gap-6">
        {props.brandFetchedData &&
          records.map((medicine) => (
            <MedCard medicine={medicine} key={medicine.Brand.id} />
          ))}
      </div>
      <nav>
        <ul className="flex items-center justify-center">
          {
              currentPage!==1 && <li className="ml-2 mr-4  hover:text-c2">
              <a className="page-link" href="#" onClick={prevPage}>
                <AiOutlineArrowLeft/>
              </a>
            </li>
          }
          
          {pages.map((page) => (
            <li
              className={
                page === currentPage
                  ? "text-c1 font-bold mr-4 hover:text-c2 "
                  : "mr-4 hover:text-c2 "
              }
            >
              <a className="page-link" href="#" onClick={() => setPage(page)}>
                {page}
              </a>
            </li>
          ))}
          {
            currentPage!==nPages &&
            <li className="mr-4 hover:text-c2">
            <a className="page-link" href="#" onClick={nextPage}>
              <AiOutlineArrowRight/>
            </a>
          </li>
          }
          
        </ul>
      </nav>
    </div>
  );
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
};

export default MedCards;
