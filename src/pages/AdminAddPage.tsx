import { useNavigate } from "react-router-dom";
import { usePage, usePopup } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { Controller, useForm } from "react-hook-form";
import { CreateUser } from "../types/User";
import { AlertPopup, ConfirmPopup } from "../components/Popup";
import _user from "../services/UserService";
import BackButton from "../components/BackButton";

const AdminAddPage: React.FC = () => {
    const{ setPage } = usePage();
    setPage("");
    const { showPopup, hidePopup } = usePopup();
    const { handleError } = errorHandler();
    const navigate = useNavigate();

    const { control, handleSubmit } = useForm<CreateUser>();

    const onSubmit = (data: CreateUser) => {
        const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;
        if (data.password!== confirmPassword) {
            showPopup(
                <AlertPopup message="Password does not match" onConfirm={hidePopup} />
            )
            return;
        }
        showPopup(
            <ConfirmPopup message="Are you sure you want to register this admin?"
                onConfirm={() => {
                    _user.post(data)
                        .then(() => {
                            hidePopup();
                            showPopup(
                                <AlertPopup message="Admin registered successfully" onConfirm={() => {
                                    hidePopup();
                                    navigate(-1);
                                }} />
                            )
                        })
                        .catch(error => {
                            handleError(error);
                        });
                }}
                onCancel={hidePopup} />
        )
    }

    return (
        <>
            <div className="p-3">
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-start gap-3">
                        <BackButton />
                        <h3 className="text-white mb-0 fw-bold">Register Admin</h3>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
                        <Controller
                            name="name"
                            rules={{required: true}}
                            control={control}
                            render={({field}) => (
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input {...field} className="form-control" placeholder="Type the admin's name here"/>
                                </div>
                            )}
                        />
                        <Controller
                            name="email"
                            rules={{required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i}}
                            control={control}
                            render={({field}) => (
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input {...field} className="form-control" placeholder="Type the admin's email here"/>
                                </div>
                            )}
                        />
                        <Controller
                            name="password"
                            rules={{required: true, minLength: 8}}
                            control={control}
                            render={({field}) => (
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input {...field} type="password" className="form-control" placeholder="Type the admin's password here"/>
                                </div>
                            )}
                        />
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" placeholder="Type the password again"/>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">Register Admin</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AdminAddPage;