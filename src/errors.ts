export interface IrisError extends Error {
    type: string;
}

export default class ErrorMapper extends Error {

    private type: string;

    constructor(error: IrisError) {
        super(error.message);
        this.type = error.type;
    }
}

export const StreamErrors = {
    INVALID_ACCESS: 'Invalid Access',
    INVALID_ENTITY: 'Invalid Entity',
    INTERNAL_ERROR: 'Internal Server Error',
    RESOURCE_NOT_FOUND: 'Stream Not Found'
}

export function mapErrorToStatus(error: Error) {
    const response = {
        message: error.message,
        code: 500
    }
    switch(error.message) {
        case StreamErrors.INVALID_ACCESS:
            response.code = 401;
            break;
        case StreamErrors.RESOURCE_NOT_FOUND:
            response.code = 404;
            break;
        case StreamErrors.INVALID_ENTITY:
            response.code = 415;
            break;
        case StreamErrors.INTERNAL_ERROR:
            response.code = 500;
            break;
        default:
            response.message = StreamErrors.INTERNAL_ERROR;
            response.code = 500;
    }

    return response;
}

export function checkForExpctedError(error: Error): boolean {
    switch(error.message) {
        case StreamErrors.INVALID_ACCESS:
            return true;
        case StreamErrors.RESOURCE_NOT_FOUND:
            return true;
        case StreamErrors.INVALID_ENTITY:
            return true;
        case StreamErrors.INTERNAL_ERROR:
            return true;
        default:
            return false;
    }
}