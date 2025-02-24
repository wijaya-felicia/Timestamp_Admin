import axios from 'axios';

export async function uploadImage(url: string, file: File): Promise<void> {
    return axios.put<void>(url, file, {
        headers: {
            'Content-Type': file.type,
        },
        }).then(response => {
            return response.data;
        }).catch(error => {
            throw error
        })
}