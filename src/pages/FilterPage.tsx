import { useEffect, useState } from "react";
import { usePage } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { Filter } from "../types/Filter";
import _filter from "../services/FilterService";
import LoadingPage from "./LoadingPage";
import { Overflow } from "../components/Overflow";
import AddButton from "../components/AddButton";

const FilterPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Filters");
    const { handleError } = errorHandler();

    const [ isFetching, setIsFetching ] = useState(true);
    const [ filters, setFilters ] = useState<Filter[]>([]);

    useEffect(() => {
        const fetch = async () => {
            _filter.get()
                .then(response => {
                    setFilters(response);
                }).catch(error => {
                    handleError(error);
                }).finally(() => {
                    setIsFetching(false);
                })
        };
        fetch();
    }, []);

    if(isFetching) {
        return <LoadingPage />;
    }

    return (
        <>
            <Overflow height="calc(100vh - 90px)">
                <div className="d-flex flex-md-wrap">
                    {filters.map((filter) => (
                        <div key={filter.id} className="col-md-4 p-3">
                            <a href={"/filters/".concat(filter.id)} className="card bg-tertiary text-white h-100 w-100 text-decoration-none">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: "40px", height: "40px"}}>
                                            <i className="bi bi-camera-filters fs-5"></i>
                                        </div>
                                        <h4 className="card-title m-0">{filter.name}</h4>
                                    </div>
                                    <div className="d-flex justify-content-end mt-auto">
                                        <a href={"/filters/".concat(filter.id)} className="btn btn-secondary">
                                            Edit
                                        </a>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </Overflow>
            <AddButton />
        </>
    )
}

export default FilterPage;
