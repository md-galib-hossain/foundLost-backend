"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const claim_service_1 = require("./claim.service");
const createClaim = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Authentication token not found !');
    }
    const result = yield claim_service_1.claimService.createClaimIntoDB(req.body, token);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Claim created successfully",
        data: result,
    });
}));
const getClaims = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Authentication token not found !');
    }
    const result = yield claim_service_1.claimService.getClaimsfromDB(token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Claims  retrieved successfully",
        data: result,
    });
}));
const updateClaim = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { claimId } = req.params;
    const token = req.headers.authorization;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Authentication token not found !');
    }
    const result = yield claim_service_1.claimService.updateClaimIntoDB(token, claimId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Claim updated successfully",
        data: result,
    });
}));
exports.claimController = {
    createClaim, getClaims, updateClaim
};
