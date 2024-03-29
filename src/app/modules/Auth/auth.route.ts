import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidations } from "./user.validation";

const router = express.Router();
router.post("/login", validateRequest(authValidations.loginUser),AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);




export const AuthRoutes = router;
