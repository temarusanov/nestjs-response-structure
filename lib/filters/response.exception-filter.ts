import {
    Catch,
    ArgumentsHost,
    Logger,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { ResponseFilterConfig, ResponsePayload, ErrorInfo } from '../interfaces'

const NO_DESCRIPTION = 'No description provided'

@Catch()
export class ResponseFilter implements GqlExceptionFilter {
    private _logger = new Logger(ResponseFilter.name)

    constructor(
        private readonly _config: ResponseFilterConfig = { stack: true },
    ) {}

    catch(exception: Error, _host: ArgumentsHost): ResponsePayload<unknown> {
        const id = uuid()
        const code =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        const { message, description } = this._getErrorInfo(exception)

        const { stack } = this._config

        const stackMessage = stack ? exception.stack : undefined

        this._logger.error(
            {
                id,
                message,
                description,
            },
            exception.stack,
        )

        return {
            error: {
                id,
                code,
                message,
                description,
                stack: stackMessage,
            },
        }
    }

    /**
     * @summary Retrieves `message` and `description` that were originally sent to NestJS' `HttpException` constructor
     * @param exception caught in `ResponseFilter`
     * @returns `message` and `description` fields wrapped in object
     */
    private _getErrorInfo(exception: Error): ErrorInfo {
        const errorResponse =
            exception instanceof HttpException ? exception.getResponse() : {}

        if (typeof errorResponse === 'string') {
            return {
                message: exception.name,
                description: exception.message,
            }
        }

        return {
            message: errorResponse.hasOwnProperty('message')
                ? errorResponse['message']
                : exception.name,
            description: errorResponse.hasOwnProperty('description')
                ? errorResponse['description']
                : NO_DESCRIPTION,
        }
    }
}
