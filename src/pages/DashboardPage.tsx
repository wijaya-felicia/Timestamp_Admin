import { useEffect, useState } from "react";
import { usePage } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { Booth } from "../types/Booth";
import { Log } from "../types/Log";
import { User } from "../types/User";
import _booth from "../services/BoothService";
import _frame from "../services/FrameService";
import _theme from "../services/ThemeService";
import _user from "../services/UserService";
import LoadingPage from "./LoadingPage";
import _filter from "../services/FilterService";
import { Overflow, OverflowX } from "../components/Overflow";
import Icon from "../components/Icon";
import { unixToDate } from "../utils/TimeConverter";

const DashboardPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Home");
    const { handleError } = errorHandler();

    const [ isFetching, setIsFetching ] = useState(true);

    const [ urgentBooths, setUrgentBooths ] = useState<Booth[]>([]);
    const [ warningBooths, setWarningBooths ] = useState<Booth[]>([]);
    const [ activeBooths, setActiveBooths ] = useState<Booth[]>([]);

    const [ adminLogs, setAdminLogs ] = useState<Log[]>([]);
    const [ admins, setAdmins ] = useState<User[]>([]);

    const [ adminCount, setAdminCount ] = useState(0);
    const [ boothCount, setBoothCount ] = useState(0);
    const [ filterCount, setFilterCount ] = useState(0);
    const [ frameCount, setFrameCount ] = useState(0);
    const [ themeCount, setThemeCount ] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            await _booth.get()
                .then(response => {
                    setBoothCount(response.length);
                    setUrgentBooths(response.filter(booth => booth.status === 2));
                    setWarningBooths(response.filter(booth => booth.status === 1));
                    setActiveBooths(response.filter(booth => booth.status === 0));
                }).catch(error => {
                    handleError(error);
                })
            await _user.getLogs()
                .then(response => {
                    setAdminLogs(response.reverse());
                }).catch(error => {
                    handleError(error);
                })
            _user.get()
                .then(response => {
                    setAdminCount(response.length);
                    setAdmins(response);
                }).catch(error => {
                    handleError(error);
                }).finally(() => {
                    setIsFetching(false);
                })
            _filter.get()
                .then(response => {
                    setFilterCount(response.length);
                }).catch(error => {
                    handleError(error);
                })
            _frame.get()
                .then(response => {
                    setFrameCount(response.length);
                }).catch(error => {
                    handleError(error);
                })
            _theme.get()
                .then(response => {
                    setThemeCount(response.length);
                }).catch(error => {
                    handleError(error);
                })
        };
        fetch();
    }, []);

    const getUser = (userId: string) => {
        return admins.find(admin => admin.id === userId);
    }

    if(isFetching) {
        return <LoadingPage />;
    }

    return (
        <>
            <Overflow height="calc(100vh - 90px)">
                <div className="d-flex flex-column align-items-center py-3 gap-5 h-100">
                    <OverflowX width="calc(100vw - 137px)">
                        <div className="d-flex w-100 align-items-stretch justify-content-evenly">
                            <div className="col px-3">
                                <a href="/booths" className="card text-white text-decoration-none w-100 h-100">
                                    <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <h3 className="card-title text-nowrap">Manage Booths</h3>
                                        <p className="card-text text-nowrap fs-5">{boothCount} Booths Available</p>
                                    </div>
                                </a>
                            </div>
                            <div className="col px-3">
                                <a href="/themes" className="card text-white text-decoration-none w-100 h-100">
                                    <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <h3 className="card-title text-nowrap">Manage Themes</h3>
                                        <p className="card-text text-nowrap fs-5">{themeCount} Themes Available</p>
                                    </div>
                                </a>
                            </div>
                            <div className="col px-3">
                                <a href="/frames" className="card text-white text-decoration-none w-100 h-100">
                                    <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <h3 className="card-title text-nowrap">Manage Frames</h3>
                                        <p className="card-text text-nowrap fs-5">{frameCount} Frames Available</p>
                                    </div>
                                </a>
                            </div>
                            <div className="col px-3">
                                <a href="/filters" className="card text-white text-decoration-none w-100 h-100">
                                    <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <h3 className="card-title text-nowrap">Manage Filters</h3>
                                        <p className="card-text text-nowrap fs-5">{filterCount} Filters Available</p>
                                    </div>
                                </a>
                            </div>
                            <div className="col px-3">
                                <a href="/admins" className="card text-white text-decoration-none w-100 h-100">
                                    <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <h3 className="card-title text-nowrap">Manage Admins</h3>
                                        <p className="card-text text-nowrap fs-5">{adminCount} Admins Registered</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </OverflowX>
                    <div className="d-flex flex-column flex-lg-row px-3 w-100 gap-3" style={{maxHeight: "calc(100vh - 276px)"}}>
                        <div className="flex-grow-1 card bg-tertiary">
                            <div className="card-body">
                                <h3 className="text-bold text-nowrap text-white">Booths Status</h3>
                                <hr />
                                <Overflow height="calc(100vh - 376px)">
                                    <ul className="list-group list-group-flush">
                                        {urgentBooths.map(booth => (
                                            <a href={"/booths/".concat(booth.id)} key={booth.id} className="list-group-item bg-tertiary d-flex justify-content-between align-items-center">
                                                <span className="fs-4">{booth.name}</span>
                                                <span className="badge bg-danger rounded-pill fs-5">Error</span>
                                            </a>
                                        ))}
                                        {warningBooths.map(booth => (
                                            <a href={"/booths/".concat(booth.id)} key={booth.id} className="list-group-item bg-tertiary d-flex justify-content-between align-items-center">
                                                <span className="fs-4">{booth.name}</span>
                                                <span className="badge bg-warning rounded-pill fs-5">Warning</span>
                                            </a>
                                        ))}
                                        {activeBooths.map(booth => (
                                            <a href={"/booths/".concat(booth.id)} key={booth.id} className="list-group-item bg-tertiary d-flex justify-content-between align-items-center">
                                                <span className="fs-4">{booth.name}</span>
                                                <span className="badge bg-success rounded-pill fs-5">Active</span>
                                            </a>
                                        ))}
                                    </ul>
                                </Overflow>
                            </div>
                        </div>
                        <div className="flex-grow-1 card bg-tertiary">
                            <div className="card-body">
                                <h3 className="text-bold text-nowrap text-white">Activity Log</h3>
                                <hr />
                                <Overflow height="calc(100vh - 376px)">
                                    <ul className="list-group list-group-flush">
                                        {adminLogs.map(log => (
                                            <li key={log.id} className="list-group-item bg-tertiary d-flex justify-content-between align-items-center gap-3">
                                                <div className="d-flex gap-4">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Icon type="person" />
                                                        <span className="fs-5 fw-bold">{getUser(log.userId)?.name}</span>
                                                    </div>
                                                    <span className="fs-5">{log.message}</span>
                                                </div>
                                                <span className="fs-6 text-muted text-nowrap">{unixToDate(log.timestamp)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Overflow>
                            </div>
                        </div>
                    </div>
                </div>
            </Overflow>
        </>
    )
}

export default DashboardPage;