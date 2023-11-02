import { SearchGenericOutput } from "@/models/Brand";
import { FC } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
//render list of generics

const GenericList: FC<{
  genericList: SearchGenericOutput;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}> = (props) => {
  const { currentPage, setCurrentPage } = props;
  const recordsPerPage = 15;
  const lastIndex = props.currentPage * recordsPerPage;
  const nPages = Math.ceil(props.genericList.totalCount / recordsPerPage);
  const array = [
  currentPage - 2,
  currentPage - 1,
  currentPage,
  currentPage + 1,
  currentPage + 2,
  ];
  const pages = array.filter((page) => page > 0 && page <= nPages);

  return (
    <div>
      {props.genericList.genericInfos.map((generic) => (
        <div key={generic.Generic.id}>
          <div className="m-2 p-2 border border-c2 rounded-md whitespace-nowrap overflow-hidden">
            <Link to={`/generic/${generic.Generic.id}`}>
              <div className="font-bold text-c1">{generic.Generic.name}</div>
            </Link>
            <div className="opacity-50">
              Available Brands: {generic.availableBrands}
            </div>
          </div>
        </div>
      ))}
      <nav className="mt-10 w-full pb-3">
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

export default GenericList;
