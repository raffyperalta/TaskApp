import { Router } from "express";
import { getTasks, createTask, deleteTask, updateTask } from "../controllers/taskController";
import { authenticateToken } from "../middleware/auth";
import asyncHandler from "express-async-handler";
import { validate } from "../middleware/validate";
import { taskValidator } from "../validators/taskValidator";

const router = Router();

router.get("/", getTasks);

router.post("/create",  validate(taskValidator), authenticateToken, asyncHandler(createTask))

router.delete("/delete/:id", authenticateToken, asyncHandler(deleteTask));

router.patch("/update/:id", authenticateToken, asyncHandler(updateTask));

export default router;