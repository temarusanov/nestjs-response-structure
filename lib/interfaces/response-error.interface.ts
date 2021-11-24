export interface ResponseError {
    id: string
    code: number
    message: string
    description?: string
    stack?: unknown
}
