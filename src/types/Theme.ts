export interface Theme {
    id: string;
    name: string;
    config: string;
    url: string;
}

export interface CreateTheme {
    name: string;
    config: string;
    background: File;
}