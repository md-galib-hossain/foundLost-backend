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
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const user_constant_1 = require("./user.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const auth_utils_1 = require("../Auth/auth.utils");
const config_1 = __importDefault(require("../../config"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile } = payload, userData = __rest(payload, ["profile"]);
    const hashedPassword = yield bcrypt_1.default.hash(userData === null || userData === void 0 ? void 0 : userData.password, 10);
    const checkUser = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (checkUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        userData.password = hashedPassword;
        const createdUserData = yield transactionClient.user.create({
            data: userData,
        });
        profile.userId = createdUserData.id;
        const createdUserProfileData = yield transactionClient.userProfile.create({
            data: profile,
        });
        return createdUserData;
    }));
    let user;
    if (result) {
        user = prisma_1.default.user.findUniqueOrThrow({
            where: {
                id: result === null || result === void 0 ? void 0 : result.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                profile: true,
            },
        });
    }
    return user;
});
const getUsersfromDB = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = query, remainingQueries = __rest(query, ["searchTerm"]);
    const andConditions = [];
    if (query.searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map((field) => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(remainingQueries).length > 0) {
        andConditions.push({
            AND: Object.keys(remainingQueries).map((key) => ({
                [key]: {
                    equals: remainingQueries[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0
        ? {
            AND: andConditions,
        }
        : {};
    const result = yield prisma_1.default.user.findMany({
        // where : {
        //     name :{
        //         contains : query.searchTerm as string,
        //         mode: 'insensitive'
        //     }
        // }
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            profile: true,
        },
        // include:{admin:true,patient:true,doctor:true}
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditions,
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
const getMyProfilefromDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.JWT.ACCESS_TOKEN_SECRET);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are unauthorised");
    }
    const result = yield prisma_1.default.userProfile.findUniqueOrThrow({
        where: {
            userId: decoded.id,
        },
        select: {
            id: true,
            userId: true,
            bio: true,
            age: true,
            createdAt: true,
            updatedAt: true,
            user: true,
        },
    });
    return result;
});
const updateMyProfileIntoDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.JWT.ACCESS_TOKEN_SECRET);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are unauthorised");
    }
    yield prisma_1.default.userProfile.findUniqueOrThrow({
        where: { userId: decoded === null || decoded === void 0 ? void 0 : decoded.id },
    });
    const result = yield prisma_1.default.userProfile.update({
        where: {
            userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
        },
        data: payload,
        select: {
            id: true,
            userId: true,
            bio: true,
            age: true,
            createdAt: true,
            updatedAt: true,
            user: true,
        },
    });
    return result;
});
exports.userService = {
    createUserIntoDB,
    getUsersfromDB,
    getMyProfilefromDB,
    updateMyProfileIntoDB,
};
