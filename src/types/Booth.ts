export interface Booth {
    id: string;
    name: string;
    description: string;
    status: number;
    clientKey: string;
    serverKey: string;
    themeId: string;
    frameIds: string[];
}

export interface CreateBooth {
    name: string;
    description: string;
    clientKey: string;
    serverKey: string;
    themeId: string;
    frameIds: string[];
}