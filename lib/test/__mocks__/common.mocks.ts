export const mockLogger = {
    log: (message: any, context?: string) => {},
    error: (message: any, trace?: string, context?: string) => {},
    warn: (message: any, context?: string) => {},
    debug: (message: any, context?: string) => {},
    verbose: (message: any, context?: string) => {},
}

export const mockJson = jest.fn()

export const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
}))

export const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
}))

export const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
}))

export const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
}
