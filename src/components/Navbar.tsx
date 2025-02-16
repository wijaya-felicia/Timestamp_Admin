import _auth from "../services/AuthService";
import { useEffect, useState } from "react";
import { User } from "../types/User";
import './Navbar.css';
import { usePage } from "../hooks/Context";

const Navbar: React.FC = () => {
    const { page } = usePage();
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user: User = await _auth.user();
            if (user) {
                setName(user.name);
            } else {
                setName(null);
            }
        };
        fetchUser();
    }, []);
    
    return (
        <>
            <nav className="navbar navbar-expand">
                <div className="container-fluid px-3">
                    <a className="navbar-brand text-white fs-3" href="/">Timestamp | Admin</a>
                    <h1 className="text-white fs-3 m-auto d-none d-md-block">{page}</h1>
                    <div id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle text-white fs-3" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Hello, {name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end bg-secondary shadow-lg">
                                    <li className="mb-2"><a href="#" className="dropdown-item" id="dropdown-item">Edit Profile</a></li>
                                    <li className="mb-2"><a href="#" className="dropdown-item" id="dropdown-item">Manage Admin</a></li>
                                    <li className="mb-2"><a href="/login" onClick={_auth.logout} className="dropdown-item" id="dropdown-item">logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;