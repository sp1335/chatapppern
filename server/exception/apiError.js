module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors
    }

    static unAuthorized() {
        return new ApiError(401, 'User not authorized')
    }
    static badRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }
    static conflict(message, errors = []) {
        return new ApiError(409, message, errors);
    }
}