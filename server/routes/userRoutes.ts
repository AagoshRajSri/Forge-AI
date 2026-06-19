import express from "express";
import {
  createUserProject,
  getUserCredits,
  getUserProject,
  getUserProjects,
  purchaseCredits,
  togglePublish,
  getUserProfile
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/credits", protect, getUserCredits);
userRouter.post("/project", protect, createUserProject);
userRouter.post("/create-project", protect, createUserProject);
userRouter.get("/project/:projectId", protect, getUserProject);
userRouter.get("/projects", protect, getUserProjects);
userRouter.get("/publish-toggle/:projectId", protect, togglePublish);
userRouter.post("/purchase-credits", protect, purchaseCredits);
userRouter.get("/profile", protect, getUserProfile);

export default userRouter;
