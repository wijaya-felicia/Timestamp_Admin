import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon"

const EditButton: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (
        <div className="position-absolute bottom-0 end-0 m-4">
            <button className="btn btn-quaternary rounded-pill d-flex justify-content-center align-items-center p-3" onClick={() => navigate(pathname.concat("/edit"))}>
                <Icon type="edit" />
            </button>
        </div>
    )
}

export default EditButton;