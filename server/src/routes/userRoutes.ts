import { Router } from "express";
import { createUser, modifyPassword, login } from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";
import asyncHandler from "express-async-handler";
import { validate } from "../middleware/validate";
import { userValidator,  modifyPasswordValidator} from "../validators/userValidator";

const router = Router();

router.post("/register", validate(userValidator),asyncHandler(createUser));

router.patch("/modifypassword/:id", validate(modifyPasswordValidator), authenticateToken, asyncHandler(modifyPassword));

router.post("/login", validate(userValidator), asyncHandler(login));


export default router;