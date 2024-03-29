"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidations = void 0;
const zod_1 = require("zod");
const loginUser = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "email field is required",
        }),
        password: zod_1.z.string({
            required_error: "password field is required",
        }),
    }),
});
exports.authValidations = { loginUser };
