import { useParams } from "react-router-dom";
import { usePage } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { useEffect, useState } from "react";
import { Frame } from "../types/Frame";
import _theme from "../services/ThemeService";
import _frame from "../services/FrameService";
import InvalidPage from "./InvalidPage";
import LoadingPage from "./LoadingPage";
import { Theme } from "../types/Theme";
import { Overflow } from "../components/Overflow";
import BackButton from "../components/BackButton";
import EditButton from "../components/EditButton";

const FrameDetailPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Frames");
    const { handleError } = errorHandler();

    const { id } = useParams();
    const [ isInvalid, setIsInvalid ] = useState<boolean>(false);
    const [ isFetching, setIsFetching ] = useState<boolean>(true);

    const [ frame, setFrame ] = useState<Frame | undefined>(undefined);
    const [ isFetchingFrame, setIsFetchingFrame ] = useState<boolean>(true);
    const [ theme, setTheme ] = useState<Theme | undefined>(undefined);

    useEffect(() => {
        const fetch = async () => {
            if(isFetchingFrame) {
                _frame.get(id)
                    .then(response => {
                        if(response[0] && response[0].id === id) setFrame(response[0]);
                        else setIsInvalid(true);
                    }).catch(error => {
                        handleError(error);
                    }).finally(() => {
                        setIsFetchingFrame(false);
                    })
            }
            else {
                _theme.get(frame?.themeId)
                    .then(response => {
                        if(response[0].id === frame?.themeId) setTheme(response[0]);
                    }).catch(error => {
                        handleError(error);
                    }).finally(() => {
                        setIsFetching(false);
                    })
            }
        }
        fetch();
    }, [isFetchingFrame]);

    if(isFetching) {
        return <LoadingPage />;
    }
    
    if(isInvalid) {
        return <InvalidPage />;
    }

    return (
        <>
            <Overflow height="calc(100vh - 90px)">
                <div className="p-3">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <BackButton />
                                <h3 className="text-white mb-0 fw-bold">{frame?.name}</h3>
                            </div>
                            {/* <a className="btn btn-danger" onClick={destroy}>Delete Frame</a> */}
                        </div>
                    </div>
                </div>
                <EditButton />
            </Overflow>
        </>
    )
}

export default FrameDetailPage;