import { Filter } from "../types/Filter";
import { ReturnList } from "../types/Response";
import _api from "./APIService";

const FilterService = {
    async get(id?: string | null): Promise<Filter[]> {
        var url = "filters?"
        if (id) url += `id=${id}`;
        return _api.get<ReturnList<Filter>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    }
}

export default FilterService;