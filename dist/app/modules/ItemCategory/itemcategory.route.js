"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const itemcategory_validation_1 = require("./itemcategory.validation");
const itemcategory_controller_1 = require("./itemcategory.controller");
const router = express_1.default.Router();
router.post("/found-item-categories", (0, validateRequest_1.default)(itemcategory_validation_1.itemCategoryValidations.createItemCategory), itemcategory_controller_1.itemCategoryController.createFoundItemCategory);
// router.get("/users", userController.getUsers);
exports.itemCategoryRoutes = router;
