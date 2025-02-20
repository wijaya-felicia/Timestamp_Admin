import { isValidElement } from "react";
import { usePopup } from "../hooks/Context";

interface ConfirmPopupProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
    message,
    onConfirm,
    onCancel
}) => {
    return (
        <>
            <p className="text-white">
                {message}
            </p>
            <div className="mt-3 d-flex justify-content-center gap-3">
                <button className="btn btn-danger" onClick={onCancel}>
                    No
                </button>
                <button className="btn btn-success" onClick={onConfirm}>
                    Yes
                </button>
            </div>
        </>
    );
}

interface AlertPopupProps {
    message: string;
    onConfirm: () => void;
}

export const AlertPopup: React.FC<AlertPopupProps> = ({
    message,
    onConfirm
}) => {
    return (
        <>
            <p className="text-white">
                {message}
            </p>
            <div className="mt-3 d-flex justify-content-center">
                <button className="btn btn-danger" onClick={onConfirm}>
                    Close
                </button>
            </div>
        </>
    );
}

export const Popup: React.FC = () => {
    const { popupContent } = usePopup();
    if(!popupContent) return null;

    if(isValidElement(popupContent)) {
        return (
            <div className="modal fade show d-flex align-items-center justify-content-center" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            {popupContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null;
}