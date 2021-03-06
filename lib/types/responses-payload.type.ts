import { Type } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { ResponseError } from '../interfaces/response-error.interface'
import { ResponsesPayload } from '../interfaces/responses-payload.interface'
import { ResponseErrorType } from './response-error.type'

export type NullableListOptions = { nullable: true | 'itemsAndList' }

/**
 *
 * @param classRef Initial class with `@ObjectType` decorator
 * @param options nullability options, returning `[Type]!` or `[Type!]!` is disallowed due to nature of response structure -
 * `data` field will always be (`GraphQL`-wise) null when error is thrown
 *
 * You can provide `true` (default) to generate `[Type!]` definition
 * or `'itemsAndList'` to generate `[Type]` definition in resulting `.graphql` schema file
 *
 * @see NullableListOptions
 */
export const ResponsesPayloadType = <T>(
    classRef: Type<T>,
    options: NullableListOptions = { nullable: true },
): Type<ResponsesPayload<T>> => {
    @ObjectType('ResponsesPayload', { isAbstract: true })
    class ResponsesPayloadType implements ResponsesPayload<T> {
        @Field(() => [classRef], { nullable: options.nullable })
        data?: T[]

        @Field(() => ResponseErrorType, { nullable: true })
        error?: ResponseError
    }

    return ResponsesPayloadType
}
