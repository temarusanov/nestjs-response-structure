import { Type } from '@nestjs/common'
import { Field, NullableList, ObjectType } from '@nestjs/graphql'
import { ResponseError } from '../interfaces/response-error.interface'
import { ResponsesPayload } from '../interfaces/responses-payload.interface'
import { ResponseErrorType } from './response-error.type'

export const ResponsesPayloadType = <T>(
    classRef: Type<T>,
    options: { nullableList: boolean | NullableList } = { nullableList: false },
): Type<ResponsesPayload<T>> => {
    @ObjectType('ResponsesPayload', { isAbstract: true })
    class ResponsesPayloadType implements ResponsesPayload<T> {
        @Field(() => [classRef], { nullable: options.nullableList })
        data?: T[]

        @Field(() => ResponseErrorType, { nullable: true })
        error?: ResponseError
    }

    return ResponsesPayloadType
}
