import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

const BackButton: React.FC = () => {
    const navigate = useNavigate();
    return (
        <button className="btn btn-primary rounded-pill d-flex justify-content-center align-items-center p-2" onClick={() => navigate(-1)}>
            <Icon type="back" />
        </button>
    )
}

export default BackButton;