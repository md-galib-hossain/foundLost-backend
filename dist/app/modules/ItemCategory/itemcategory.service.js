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
exports.foundItemCategoryService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const auth_utils_1 = require("../Auth/auth.utils");
const config_1 = __importDefault(require("../../config"));
const createFoundItemCategoryIntoDB = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const checkexist = yield prisma_1.default.foundItemCategory.findUnique({
        where: {
            name: payload.name,
        },
    });
    if (checkexist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Already Exist with this name");
    }
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.JWT.ACCESS_TOKEN_SECRET);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are unauthorised");
    }
    const result = yield prisma_1.default.foundItemCategory.create({
        data: payload,
    });
    return result;
});
exports.foundItemCategoryService = {
    createFoundItemCategoryIntoDB,
};
