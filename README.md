# NestJS Response Structure

GraphQL Types and interfaces for great response. The library provides types for the structured display of responses to the client.

## Features

- Structured types covered with TypeScript
- `data` and `error` fields only without any extensions
- Detailed error information including uuid, description, code, message and stacktrace
- Stacktrace can be disabled in any time. Example: production mode

**Example success response:**

```json
{
    "data": {
        "users": {
            "createUser": {
                "data": {
                    "id": "b9bec407-7f65-4586-869c-4d72b85c7624",
                    "name": "tema"
                },
                "error": null
            }
        }
    }
}
```

**Example error response:**

```json
{
    "data": {
        "users": {
            "getUser": {
                "data": null,
                "error": {
                    "id": "c1b2e2fc-348a-4f14-96e0-5c196bf8e149",
                    "message": "USER_NOT_FOUND",
                    "code": 404,
                    "description": "User not found with id 6cb26c8d-f6ab-4b7f-9bfa-f6703cbc17e2",
                    "stack": null
                }
            }
        }
    }
}
```

## Installation

Requires node version >=12.х

```bash
npm i --save nestjs-response-structure
```

## Documentation

### Setting up

1. Add filter to your NestJS project. It will catch all errors and return formatted error.

```ts
// main.ts

import { ResponseFilter } from 'nestjs-response-structure'

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)

    app.useGlobalFilters(new ResponseFilter({}))

    // your code here
}
```

2. Extend your GraphQL type. You can also make it abstract.

```ts
// user.type.ts

import { ResponsePayloadType } from 'nestjs-response-structure'

@ObjectType({ isAbstract: true })
class UserPayloadType {
    @Field(() => ID)
    id: string

    @Field()
    name: string
}

@ObjectType('User')
export class UserType extends ResponsePayloadType(UserPayloadType) {}
```

3. Throw your custom errors. Filter uses NestJS exceptions and take `message` and `description` from NestJS error response.


```ts
// user.service.ts

const user = await userRepository.findOne({ id })

if (!user) {
    throw new NotFoundException({
        message: 'USER_NOT_FOUND',
        description: `User not found with id ${id}`,
    })        
}

return user
```

### Error type fields

- `id` auto generated UUID to quickly find an entry in logs.
- `message` is used for code message responses. For example, if frontend have a localization by the error code message.
- `code` HTTP status codes.
- `description` is used for development. The field helps to find out a more detailed reason for the error.
- `stack` error stacktrace. You can disable this function in the filter constructor.

## License


[MIT](https://github.com/i-link-pro-team/logardian/blob/main/LICENSE)

  