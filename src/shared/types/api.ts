export interface ApiResponse<T = unknown> {
    code: number;
    msg: string;
    data: T;
}

export interface PageParams {
    page?: number;
    page_size?: number;
}

export interface PageResult<T> {
    total: number;
    list: T[];
}

export class ApiError extends Error {
    constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly payload?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}