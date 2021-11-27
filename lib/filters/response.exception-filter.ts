import { Catch, ArgumentsHost, Logger, HttpException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { ResponseFilterConfig } from '../interfaces/response-filter-config.interface'
import { ResponsePayload } from '../interfaces/response-payload.interface'

@Catch()
export class ResponseFilter implements GqlExceptionFilter {
    private _logger = new Logger(ResponseFilter.name)

    constructor(private readonly _config: ResponseFilterConfig) {}

    catch(exception: Error, host: ArgumentsHost): ResponsePayload<unknown> {
        const code =
            exception instanceof HttpException ? exception.getStatus() : 500

        const { message, description } = this._getErrorInfo(exception)

        const { stack } = this._config

        const stackMessage =
            stack === undefined || stack === true ? exception.stack : undefined

        this._logger.error(`${message} (${description})`, exception.stack)

        return {
            error: {
                id: uuid(),
                code: code,
                message,
                description,
                stack: stackMessage,
            },
        }
    }

    private _getErrorInfo(exception: Error): {
        message: string
        description: string
    } {
        const errorResponse =
            exception instanceof HttpException
                ? (exception.getResponse() as any)
                : null

        if (typeof errorResponse === 'string' || errorResponse === null) {
            return {
                message: exception.name,
                description: exception.message as string,
            }
        }

        return {
            message:
                'message' in errorResponse
                    ? errorResponse['message']
                    : exception.name,
            description:
                'description' in errorResponse
                    ? errorResponse['description']
                    : 'No description provided',
        }
    }
}
