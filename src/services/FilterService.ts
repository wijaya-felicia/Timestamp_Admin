import { CreateFilter, Filter } from "../types/Filter";
import { ReturnData, ReturnList } from "../types/Response";
import _api from "./APIService";

const FilterService = {
    async get(id?: string | null): Promise<Filter[]> {
        var url = "filters?"
        if (id) url += `id=${id}&`;
        return _api.get<ReturnList<Filter>>(url)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async post(filter: CreateFilter): Promise<Filter> {
        return _api.post<ReturnData<Filter>>("filters", filter)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async put(id: string, filter: CreateFilter): Promise<Filter> {
        return _api.put<ReturnData<Filter>>(`filters/${id}`, filter)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    },

    async delete(id: string): Promise<Filter> {
        return _api.delete<ReturnData<Filter>>(`filters/${id}`)
            .then(response => {
                return response.data.data;
            }).catch(error => {
                throw error
            })
    }
}

export default FilterService;