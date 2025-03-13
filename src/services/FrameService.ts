import { CreateFrame, Frame } from "../types/Frame";
import { ReturnData, ReturnList } from "../types/Response";
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
    },

    async post(frame: CreateFrame): Promise<Frame> {
        return _api.post<ReturnData<Frame>>("frames", frame)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async put(id: string, frame: CreateFrame): Promise<Frame> {
        return _api.put<ReturnData<Frame>>(`frames/${id}`, frame)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async delete(id: string): Promise<Frame> {
        return _api.delete<ReturnData<Frame>>(`frames/${id}`)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    }
}

export default FrameService;