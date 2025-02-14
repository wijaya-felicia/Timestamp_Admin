import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const HomePage: React.FC = () => {
    return (
        <>
            <div className="container-fluid min-vh-100 d-flex flex-column ">
                <Navbar />
                <div className="d-flex flex-row pb-3 flex-grow-1">
                    <Sidebar />
                    <main className="bg-secondary p-3 flex-grow-1 rounded-3">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    )
}

export default HomePage;