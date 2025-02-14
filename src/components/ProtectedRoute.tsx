import { Navigate } from "react-router-dom";
import auth from "../services/AuthService";

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children
}) => {
    if(!auth.isAuthenticated()) {
        return (
            <>
                <Navigate to="/login" replace/>
            </>
        );
    }
    return children;
}

export default ProtectedRoute;