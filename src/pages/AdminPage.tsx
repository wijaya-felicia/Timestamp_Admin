import { useEffect, useState } from "react";
import { User } from "../types/User";
import _user from "../services/UserService";
import { errorHandler } from "../hooks/ErrorHandler";
import LoadingPage from "./LoadingPage";
import { usePage, usePopup } from "../hooks/Context";
import AddButton from "../components/AddButton";
import { Overflow } from "../components/Overflow";

const AdminPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("");
    const { handleError } = errorHandler();

    const [ isFetching, setIsFetching ] = useState<boolean>(true);
    
    const [ admins, setAdmins ] = useState<User[]>([]);

    useEffect(() => {
        const fetch = () => {
            _user.get()
                .then(response => {
                    setAdmins(response);
                }).catch(error => {
                    handleError(error);
                }).finally(() => {
                    setIsFetching(false);
                })
        }
        fetch();
    }, [isFetching]);

    if(isFetching) {
        return <LoadingPage />;
    }

    return (
        <>
            <Overflow height="calc(100vh - 90px)">
                <div className="d-flex flex-md-wrap">
                    {admins.map((admin) => (
                        <div key={admin.id} className="col-md-2 p-3">
                            <div className="card bg-tertiary text-white h-100 w-100 text-decoration-none">
                                <div className="card-body">
                                    <h4 className="card-title">{admin.name}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Overflow>
            <AddButton />
        </>
    )
}

export default AdminPage;