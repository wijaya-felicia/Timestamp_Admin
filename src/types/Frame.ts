export interface Frame {
    id: string;
    name: string;
    themeId: string;
    count: number;
    price: number;
    split: boolean;
    layouts: Layout[];
    url: string;
}

export interface Layout {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CreateFrame {
    name: string;
    themeId: string;
    count: number;
    price: number;
    split: boolean;
    layouts: Layout[];
    image: File;
}