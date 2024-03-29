"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    //default values
    let statusCode = 500;
    let success = false;
    let message = "Something went wrong!";
    let errorDetails = {};
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        console.log(simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources);
        errorDetails = { issues: simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources };
        // errorDetails.issues = simplifiedError?.errorSources;
    }
    else if (err instanceof AppError_1.default) { //App error
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        errorDetails = [{
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message
            }];
    }
    else if (err instanceof Error) { //Error
        message = err === null || err === void 0 ? void 0 : err.message;
        errorDetails = [{
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message
            }];
    }
    return res.status(statusCode).json({
        success: false,
        message: message,
        errorDetails: Object.keys(errorDetails).length ? errorDetails : err,
    });
};
exports.default = globalErrorHandler;
