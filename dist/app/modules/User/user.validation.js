"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const createUser = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name field is required",
        }),
        email: zod_1.z.string({
            required_error: "email field is required",
        }),
        password: zod_1.z.string({
            required_error: "password field is required",
        }),
        profile: zod_1.z.object({
            bio: zod_1.z.string({
                required_error: "bio field is required",
            }),
            age: zod_1.z.number({
                required_error: "age field is required",
            }),
        }),
    }),
});
const updateUserProfile = zod_1.z.object({
    body: zod_1.z.object({
        bio: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
    }),
});
exports.userValidations = { createUser, updateUserProfile };
