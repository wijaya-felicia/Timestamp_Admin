import { useEffect, useState } from "react";
import { usePage } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { Frame } from "../types/Frame";
import _frame from "../services/FrameService";
import LoadingPage from "./LoadingPage";
import Overflow from "../components/Overflow";
import AddButton from "../components/AddButton";

const FramePage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Frames");
    const { handleError } = errorHandler();

    const [ isFetching, setIsFetching ] = useState(true);

    const [ frames, setFrames ] = useState<Frame[]>([]);

    useEffect(() => {
        const fetch = async () => {
            _frame.get()
                .then(response => {
                    setFrames(response);
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
                {frames.map((frame, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <a href={"/frames/".concat(frame.id)} className="card bg-tertiary text-white h-100 w-100 text-decoration-none">
                            <div className="row h-100">
                                <div className="col-md-3" style={{maxHeight: "150px"}}>
                                    <img src={frame.url} alt="" className="rounded h-100 w-100 object-fit-contain" />
                                </div>
                                <div className="col-md-9 ps-md-0">
                                    <div className="card-body d-flex flex-column h-100 justify-content-between">
                                        <h4 className="card-title">{frame.name}</h4>
                                        <div className="d-flex justify-content-end">
                                            <a href={"/frames/".concat(frame.id)} className="btn btn-secondary">
                                                Details
                                            </a>
                                        </div>
                                    </div>
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

export default FramePage;