import { ResponseError } from './response-error.interface'

export interface ResponsesPayload<T> {
    data?: T[]
    error?: ResponseError
}
