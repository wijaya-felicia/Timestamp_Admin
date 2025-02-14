import { useState } from "react";
import { Credential } from "../types/User";
import _auth from "../services/AuthService";
import { Navigate, useNavigate } from "react-router-dom";
import { InvalidError } from "../utils/AppError";

const LoginPage: React.FC = () => {
    const [form, setForm] = useState<Credential>();
    const [error, setError] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target as HTMLInputElement;
        setForm({...form as Credential, [name]: value });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setSubmitting(true);
        event.preventDefault();

        try {
            await _auth.login(form as Credential);
            navigate("/");
        } catch (error) {
            setError(error instanceof InvalidError? 'Invalid credential' : 'Unknown error while logging in')
        } finally {
            setSubmitting(false);
        }
    }

    if(_auth.isAuthenticated()) {
        return (
            <Navigate to="/" replace/>
        )
    }

    return (
        <>
            <div className="container position-absolute top-50 start-50 translate-middle justify-content-center">
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-md-4 px-4 py-3 rounded-3 bg-primary">
                        <h1 className="text-center text-white my-5">Timestamp Admin</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                                <label htmlFor="email" className="form-label text-white fs-4">Email:</label>
                                <input
                                    name="email"
                                    type="email"
                                    className={"form-control bg-tertiary border-0 text-white ".concat(error ?"is-invalid" : "")}
                                    id="email"
                                    value={form?.email}
                                    onChange={handleChange}
                                    placeholder="insert your email"
                                    required
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="password" className="form-label text-white fs-4">Password:</label>
                                <input
                                    name="password"
                                    type="password"
                                    className={"form-control bg-tertiary border-0 text-white ".concat(error ?"is-invalid" : "")}
                                    id="password"
                                    value={form?.password}
                                    onChange={handleChange}
                                    placeholder="insert your password"
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <div className="container-fluid py-3">
                                <div className="row">
                                    <div className="col-4"></div>
                                    <button className="col-4 btn btn-tertiary btn-block text-white" disabled={submitting}>Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;