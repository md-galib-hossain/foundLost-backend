"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const statusCode = 400;
    const errorMessages = err.issues.map((issue) => issue.message).join('. ');
    const errorSources = err.issues.map((issue) => {
        var _a;
        return {
            field: issue === null || issue === void 0 ? void 0 : issue.path[((_a = issue === null || issue === void 0 ? void 0 : issue.path) === null || _a === void 0 ? void 0 : _a.length) - 1],
            message: issue === null || issue === void 0 ? void 0 : issue.message,
        };
    });
    return {
        statusCode,
        message: errorMessages,
        errorSources,
    };
};
exports.default = handleZodError;
