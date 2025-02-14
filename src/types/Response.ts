import { User } from "./User";

export interface ReturnData<T> {
    data: T;
}

export interface ReturnList<T> {
    data: T[];
}

export interface ReturnToken {
    data: User;
    token: string;
}