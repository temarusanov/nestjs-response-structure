import { ResponseError } from "./response-error.interface"

export interface ResponsePayload<T> {
    data?: T
    error?: ResponseError
}
