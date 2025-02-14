import { useEffect, useState } from "react";
import { Booth } from "../types/Booth";
import _booth from "../services/BoothService";
import { usePage } from "../hooks/Context";
import LoadingPage from "./LoadingPage";
import { errorHandler } from "../hooks/ErrorHandler";
import AddButton from "../components/AddButton";
import Overflow from "../components/Overflow";

const BoothPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Booths");
    const { handleError } = errorHandler();

    const [ isFetching, setIsFetching ] = useState(true);

    const [ booths, setBooths ] = useState<Booth[]>([]);
    const statusArray = ["Active", "Warning", "Error"];

    useEffect(() => {
        const fetch = async () => {
            _booth.get()
                .then(response => {
                    setBooths(response);
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
            <Overflow>
                {booths.map((booth, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <a href={"/booths/".concat(booth.id)} className="card bg-tertiary text-white h-100 w-100 text-decoration-none">
                            <div className="card-body">
                                <h4 className="card-title">{booth.name}</h4>
                                <p className="card-text text-truncate">{booth.description}</p>
                                <div className="card-text d-flex align-items-center">
                                    Status:
                                    <span
                                        className={"px-2 py-1 rounded-pill m-0 ms-2 ".concat(
                                            booth.status == 0
                                            ? "bg-success"
                                            : booth.status == 1
                                            ? "bg-warning"
                                            : "bg-danger"
                                        )}
                                        >
                                        {statusArray[booth.status]}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <a href={"/booths/".concat(booth.id)} className="btn btn-secondary">
                                        Details
                                    </a>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </Overflow>
            <AddButton />
        </>
    )
}

export default BoothPage;