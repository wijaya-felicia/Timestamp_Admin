import { Log } from "../types/Log";
import { ReturnList } from "../types/Response";
import { User } from "../types/User";
import _api from "./APIService";

const UserService = {
    async get(id?: string | null): Promise<User[]> {
        var url = "users?"
        if (id) url += `id=${id}`;
        return _api.get<ReturnList<User>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async getLogs(id?: string | null, userId?: string | null): Promise<Log[]> {
        var url = "userLogs?"
        if (id) url += `id=${id}`;
        if (userId) url += `userId=${userId}`;
        return _api.get<ReturnList<Log>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    }
}

export default UserService;