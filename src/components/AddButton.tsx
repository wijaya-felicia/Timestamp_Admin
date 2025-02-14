import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon"

const AddButton: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (
        <div className="position-absolute bottom-0 end-0 m-4">
            <button className="btn btn-tertiary rounded-pill d-flex justify-content-center align-items-center p-3" onClick={() => navigate(pathname.concat("/add"))}>
                <Icon type="add" />
            </button>
        </div>
    )
}

export default AddButton;