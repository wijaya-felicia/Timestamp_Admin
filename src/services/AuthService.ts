import { ReturnToken } from "../types/Response";
import { Credential } from "../types/User";
import _api from "./APIService";

const AuthService = {
    async login(form: Credential) {
        await _api.post<ReturnToken>('users/login', form)
        .then(response => {
            sessionStorage.setItem("user", JSON.stringify(response.data.data));
            sessionStorage.setItem("token", response.data.token);
        }).catch(error => {
            throw error
        })
    },

    async changePassword(password: string) {
        await _api.put("users", { password })
            .catch(error => {
                throw error
            })
    },

    logout() {
        sessionStorage.clear();
    },

    isAuthenticated(): boolean {
        const token = sessionStorage.getItem("token");
        return (token && token !== '') as boolean;
    },

    async user<User>(): Promise<User> {
        if (!this.isAuthenticated()) {
            throw new Error("Not Authenticated");
        }
        return JSON.parse(sessionStorage.getItem("user") as string);
    }
}

export default AuthService;