import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const HomePage: React.FC = () => {
    return (
        <>
            <div className="d-flex flex-column" style={{ height: "100vh"}}>
                <Navbar />
                <div className="d-flex flex-grow-1">
                    <Sidebar />
                    <main className="d-flex flex-column flex-grow-1 bg-secondary me-3 mb-3 rounded-3">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    )
}

export default HomePage;