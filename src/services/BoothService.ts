import { Booth } from "../types/Booth";
import { BoothLog } from "../types/Log";
import { ReturnList } from "../types/Response";
import _api from "./APIService";

const BoothService = {
    async get(id?: string | null, themeId?: string | null, frameId?: string | null): Promise<Booth[]> {
        var url = "booths?"
        if (id) url += `id=${id}`;
        if (themeId) url += `themeId=${themeId}`;
        if (frameId) url += `frameId=${frameId}`;
        return _api.get<ReturnList<Booth>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async getLogs(id?: string | null, boothId?: string | null, status?: number | null): Promise<BoothLog[]> {
        var url = "boothLogs?"
        if (id) url += `id=${id}`;
        if (boothId) url += `boothId=${boothId}`;
        if (status) url += `level=${status}`;
        return _api.get<ReturnList<BoothLog>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    }
}

export default BoothService;