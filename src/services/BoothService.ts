import { Booth } from "../types/Booth";
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
    }
}

export default BoothService;