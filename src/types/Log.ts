export interface Log {
    id: string;
    message: string;
    userId: string;
    timestamp: string;
}

export interface BoothLog {
    id: string;
    boothId: string;
    message: string;
    level: number;
    timestamp: string;
}