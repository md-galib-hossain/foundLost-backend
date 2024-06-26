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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundItemService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const auth_utils_1 = require("../Auth/auth.utils");
const config_1 = __importDefault(require("../../config"));
const item_constant_1 = require("./item.constant");
const createFoundItemIntoDB = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const checkexist = yield prisma_1.default.foundItemCategory.findUnique({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.categoryId,
        },
    });
    if (!checkexist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "There is no Item category with this id");
    }
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.JWT.ACCESS_TOKEN_SECRET);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are unauthorised");
    }
    payload.userId = decoded === null || decoded === void 0 ? void 0 : decoded.id;
    const result = yield prisma_1.default.foundItem.create({
        data: payload,
        select: {
            id: true,
            userId: true,
            categoryId: true,
            foundItemName: true,
            description: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            user: true,
            category: true,
        },
    });
    return result;
});
const getFoundItemsfromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: item_constant_1.itemSearchableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // console.dir(andCondions, { depth: null });
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = andCondions.length > 0 ? { AND: andCondions } : {};
    const result = yield prisma_1.default.foundItem.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            foundItemName: true,
            description: true,
            location: true,
            user: true,
            category: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.default.foundItem.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.foundItemService = {
    createFoundItemIntoDB,
    getFoundItemsfromDB,
};
