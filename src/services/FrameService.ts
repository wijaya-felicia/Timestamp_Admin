import { Frame } from "../types/Frame";
import { ReturnList } from "../types/Response";
import _api from "./APIService";

const FrameService = {
    async get(id?: string | null, themeId?: string | null, count?: number | null, split?: boolean | null, boothId?: string | null): Promise<Frame[]> {
        var url = "frames?"
        if (id) url += `id=${id}&`;
        if (themeId) url += `themeId=${themeId}&`;
        if (count) url += `count=${count}&`;
        if (split) url += `split=${split}&`;
        if (boothId) url += `boothId=${boothId}&`;
        return _api.get<ReturnList<Frame>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    }
}

export default FrameService;