import { useEffect, useState } from "react";
import { User } from "../types/User";
import _auth from "../services/AuthService";
import { usePage, usePopup } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { useNavigate } from "react-router-dom";
import { AlertPopup, ConfirmPopup } from "../components/Popup";

const EditProfilePage: React.FC = () => {
    const { setPage } = usePage();
    setPage("");
    const { showPopup, hidePopup } = usePopup();
    const { handleError } = errorHandler();
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
        const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

        if (newPassword !== confirmPassword) {
            showPopup(
                <AlertPopup message="Password does not match" onConfirm={hidePopup} />
            )
            return;
        }

        showPopup(
            <ConfirmPopup message="Are you sure you want to change your password?"
                onConfirm={() => {
                    _auth.changePassword(newPassword)
                       .then(() => {
                            hidePopup();
                            showPopup(
                                <AlertPopup message="Password changed successfully" onConfirm={() => {
                                    hidePopup();
                                    _auth.logout();
                                    navigate("/login", { replace: true });
                                }} />
                            )
                        })
                       .catch(error => {
                            handleError(error);
                        });
                }}
                onCancel={hidePopup} />
        )
    };

    return (
        <>
            <div className="d-flex flex-column gap-3 p-3">
                <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password:</label>
                    <input type="password" id="newPassword" name="newPassword" className="form-control"/>
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" className="form-control"/>
                </div>
                <div>
                    <button onClick={handleChangePassword} className="btn btn-primary">Change Password</button>
                </div>
            </div>
        </>
    )
}

export default EditProfilePage;