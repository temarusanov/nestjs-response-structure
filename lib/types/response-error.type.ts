import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { ResponseError } from '../interfaces/response-error.interface'

@ObjectType(`ResponseError`)
export class ResponseErrorType implements ResponseError {
    @Field(() => ID)
    id: string

    @Field(() => Int)
    code: number

    @Field()
    message: string

    @Field({ nullable: true })
    description?: string

    @Field({ nullable: true })
    stack?: string
}
