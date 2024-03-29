"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemCategoryValidations = void 0;
const zod_1 = require("zod");
const createItemCategory = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name field is required",
        }),
    }),
});
exports.itemCategoryValidations = { createItemCategory };
