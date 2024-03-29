"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemValidations = void 0;
const zod_1 = require("zod");
const createItem = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.string({
            required_error: "categoryId field is required",
        }),
        foundItemName: zod_1.z.string({
            required_error: "foundItemName field is required",
        }),
        description: zod_1.z.string({
            required_error: "description field is required",
        }),
        location: zod_1.z.string({
            required_error: "location field is required",
        }),
    }),
});
exports.itemValidations = { createItem };
