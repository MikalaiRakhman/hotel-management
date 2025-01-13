export interface ApiException {
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;    
}