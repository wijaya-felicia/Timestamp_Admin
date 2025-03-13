import { useEffect, useState } from "react";
import { usePage } from "../hooks/Context"
import { errorHandler } from "../hooks/ErrorHandler";
import { Theme } from "../types/Theme";
import _theme from "../services/ThemeService";
import LoadingPage from "./LoadingPage";
import { Overflow } from "../components/Overflow";
import AddButton from "../components/AddButton";

const ThemePage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Themes");
    const { handleError } = errorHandler();

    const [ isFetching, setIsFetching ] = useState(true);

    const [ themes, setThemes ] = useState<Theme[]>([]);

    useEffect(() => {
        const fetch = async () => {
            _theme.get()
                .then(response => {
                    setThemes(response);
                }).catch(error => {
                    handleError(error);
                }).finally(() => {
                    setIsFetching(false);
                })
        }
        fetch();
    }, []);

    if(isFetching) {
        return <LoadingPage />;
    }

    return (
        <>
            <Overflow height="calc(100vh - 90px)">
                <div className="d-flex flex-md-wrap">
                    {themes.map((theme) => (
                        <div key={theme.id} className="col-md-4 p-3" style={{minHeight: "150px"}}>
                            <a href={"/themes/".concat(theme.id)} className="card bg-tertiary text-white h-100 w-100 text-decoration-none">
                                <div className="row h-100">
                                    <div className="col-md-5">
                                        <img src={theme.url} alt="" className="img-fluid rounded h-100" />
                                    </div>
                                    <div className="col-md-7 ps-md-0">
                                        <div className="card-body d-flex flex-column h-100 justify-content-between">
                                            <h4 className="card-title">{theme.name}</h4>
                                            <div className="d-flex justify-content-end">
                                                <a href={"/themes/".concat(theme.id)} className="btn btn-secondary">
                                                    Edit
                                                </a>
                                            </div>
                                        </div>
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

export default ThemePage;