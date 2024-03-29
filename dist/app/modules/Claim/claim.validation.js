"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimValidations = void 0;
const zod_1 = require("zod");
const createClaim = zod_1.z.object({
    body: zod_1.z.object({
        foundItemId: zod_1.z.string({
            required_error: "foundItemId field is required",
        }),
        distinguishingFeatures: zod_1.z.string({
            required_error: "distinguishingFeatures field is required",
        }),
        lostDate: zod_1.z.string({
            required_error: "lostDate field is required",
        }),
    }),
});
const updateClaim = zod_1.z.object({
    body: zod_1.z.object({
        // foundItemId: z.string({
        //   required_error: "foundItemId field is required",
        // }),
        // distinguishingFeatures: z.string({
        //   required_error: "distinguishingFeatures field is required",
        // }),
        // lostDate: z.string({
        //   required_error: "lostDate field is required",
        // }),
        status: zod_1.z.string({
            required_error: "lostDate field is required",
        }),
    }),
});
exports.claimValidations = { createClaim, updateClaim };
