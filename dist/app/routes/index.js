"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const itemcategory_route_1 = require("../modules/ItemCategory/itemcategory.route");
const item_route_1 = require("../modules/Item/item.route");
const claim_route_1 = require("../modules/Claim/claim.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/',
        route: user_route_1.userRoutes
    },
    {
        path: '/',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/',
        route: itemcategory_route_1.itemCategoryRoutes
    },
    {
        path: '/',
        route: claim_route_1.claimRoutes
    },
    {
        path: '/',
        route: item_route_1.itemRoutes
    },
];
moduleRoutes.forEach(module => router.use(module === null || module === void 0 ? void 0 : module.path, module === null || module === void 0 ? void 0 : module.route));
exports.default = router;
