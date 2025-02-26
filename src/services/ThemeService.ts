import { ReturnData, ReturnList } from "../types/Response";
import { CreateTheme, Theme } from "../types/Theme";
import _api from "./APIService";


const ThemeService = {
    async get(id?: string | null): Promise<Theme[]> {
        var url = "themes?"
        if (id) url += `id=${id}&`;
        return _api.get<ReturnList<Theme>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async post(theme: CreateTheme): Promise<Theme> {
        return _api.post<ReturnData<Theme>>("themes", theme)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async put(id: string, theme: CreateTheme): Promise<Theme> {
        return _api.put<ReturnData<Theme>>(`themes/${id}`, theme)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },
}

export default ThemeService;