import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, HttpStatus } from '@nestjs/common'

import { ResponseFilter } from './response.exception-filter'
import { ResponseError } from '..'

const mockLogger = {
    log: (message: any, context?: string) => {},
    error: (message: any, trace?: string, context?: string) => {},
    warn: (message: any, context?: string) => {},
    debug: (message: any, context?: string) => {},
    verbose: (message: any, context?: string) => {},
}
const mockJson = jest.fn()
const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
}))
const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
}))
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
}))

const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
}

describe('Response exception filter suite', () => {
    let exceptionFilter: ResponseFilter

    describe('when stacktrace enabled', () => {
        beforeEach(async () => {
            jest.clearAllMocks()
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    {
                        provide: ResponseFilter,
                        useValue: new ResponseFilter(),
                    },
                ],
            })
                .setLogger(mockLogger)
                .compile()

            exceptionFilter = module.get<ResponseFilter>(ResponseFilter)
        })

        it('should be defined', () => {
            expect(exceptionFilter).toBeDefined()
        })

        it('should have stack in error object', () => {
            const response = exceptionFilter.catch(
                new Error('random error'),
                mockArgumentsHost,
            )
            expect(response).toBeDefined()
            expect(response.data).toBeUndefined()
            expect(response.error).toBeDefined()
            expect(response.error.stack).toBeDefined()
        })
    })

    describe('when stacktrace disabled | stacktrace does not matter', () => {
        beforeEach(async () => {
            jest.clearAllMocks()
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    {
                        provide: ResponseFilter,
                        useValue: new ResponseFilter({ stack: false }),
                    },
                ],
            })
                .setLogger(mockLogger)
                .compile()

            exceptionFilter = module.get<ResponseFilter>(ResponseFilter)
        })

        it('should be defined', () => {
            expect(exceptionFilter).toBeDefined()
        })

        it('should not have stack in error object', () => {
            const response = exceptionFilter.catch(
                new Error('random error'),
                mockArgumentsHost,
            )
            expect(response).toBeDefined()
            expect(response.data).toBeUndefined()
            expect(response.error).toBeDefined()
            expect(response.error.stack).toBeUndefined()
        })

        it('should set status to INTERNAL_SERVER_ERROR if error is not instanceof HttpException', () => {
            const response = exceptionFilter.catch(
                new Error('I am not an HttpException'),
                mockArgumentsHost,
            )
            expect(response).toBeDefined()
            expect(response.data).toBeUndefined()
            expect(response.error).toBeDefined()
            expect(response.error.code).toEqual(
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        })

        it('should set given status when error is instanceof HttpException', () => {
            const response = exceptionFilter.catch(
                new BadRequestException(
                    'I am an HttpException with status code 400',
                ),
                mockArgumentsHost,
            )
            expect(response).toBeDefined()
            expect(response.data).toBeUndefined()
            expect(response.error).toBeDefined()
            expect(response.error.code).toEqual(HttpStatus.BAD_REQUEST)
        })
    })
})
