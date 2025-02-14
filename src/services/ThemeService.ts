import { ReturnList } from "../types/Response";
import { Theme } from "../types/Theme";
import _api from "./APIService";


const ThemeService = {
    async get(id?: string | null): Promise<Theme[]> {
        var url = "themes?"
        if (id) url += `id=${id}`;
        return _api.get<ReturnList<Theme>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    }
}

export default ThemeService;