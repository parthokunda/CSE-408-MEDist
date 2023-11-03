import { SearchBrandOutput } from "@/models/Brand";
import { FC } from "react";
import MedCard from "./MedCard";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
const MedCards: FC<{
  brandFetchedData: SearchBrandOutput;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}> = (props) => {
  // const [currentPage, setCurrentPage] = useState(1);
  const { currentPage, setCurrentPage } = props;
  const recordsPerPage = 15;
  const records = props.brandFetchedData.brandInfos;
  const nPages = Math.ceil(props.brandFetchedData.totalCount / recordsPerPage);
  const array = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
  const pages = array.filter((page) => page > 0 && page <= nPages);
  if (
    props.brandFetchedData.brandInfos &&
    props.brandFetchedData.brandInfos.length === 0
  ) {
    return (
      <div className="flex justify-center align-middle">No Item Found</div>
    );
  }

  console.log(props.brandFetchedData.brandInfos);

  return (
    <div className="">
      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mt-3 gap-5">
        {props.brandFetchedData.brandInfos &&
          records.map((medicine) => (
            <MedCard medicine={medicine} key={medicine.Brand.id} />
          ))}
      </div>
      <nav className="absolute bottom-0 w-full pb-3">
        <ul className="flex items-center justify-center">
          {currentPage !== 1 && (
            <li
              className="px-2 py-2 text-xl hover:rounded-full hover:text-white hover:bg-c1 duration-300"
              onClick={prevPage}
            >
              <a className="page-link">
                <AiOutlineArrowLeft />
              </a>
            </li>
          )}
          {currentPage === 1 && (
            <li className="px-2 py-2 text-xl text-opacity-30 hover:rounded-full hover:text-white hover:bg-gray-400 duration-300">
              <a className="page-link" aria-disabled>
                <AiOutlineArrowLeft />
              </a>
            </li>
          )}
          {pages.map((page) => (
            <li key={page}>
              <a
                className={
                  page === currentPage
                    ? "px-4 py-2 text-xl text-white rounded-full bg-c3 font-bold "
                    : "px-4 py-2 text-xl hover:rounded-full hover:bg-c1 hover:text-white duration-300"
                }
                onClick={() => setPage(page)}
              >
                {page}
              </a>
            </li>
          ))}
          {currentPage !== nPages && (
            <li className="px-2 py-2 text-xl hover:rounded-full hover:text-white hover:bg-c1 duration-300">
              <a className="page-link" onClick={nextPage}>
                <AiOutlineArrowRight />
              </a>
            </li>
          )}
          {currentPage === nPages && (
            <li className="px-2 py-2 text-xl text-opacity-30 hover:rounded-full hover:text-white hover:bg-gray-400 duration-300">
              <a className="page-link" aria-disabled>
                <AiOutlineArrowRight />
              </a>
            </li>
          )}
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
      //console.log(currentPage);
    }
  }
  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
};

export default MedCards;
