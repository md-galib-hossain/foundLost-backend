"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const item_controller_1 = require("./item.controller");
const item_validation_1 = require("./item.validation");
const router = express_1.default.Router();
router.post("/found-items", (0, validateRequest_1.default)(item_validation_1.itemValidations.createItem), item_controller_1.itemCategoryController.createFoundItem);
router.get("/found-items", item_controller_1.itemCategoryController.getFoundItems);
// router.get("/users", userController.getUsers);
exports.itemRoutes = router;
