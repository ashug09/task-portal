import {
  createPostTask,
  filterSortTask,
  getMultipleTask,
  getPostTasks,
  getPostedTaskWithEmail,
  getTaskWithId,
} from "../controller/task.controller.js";
import { Router } from "express";
import multer from "multer";
const taskRouter = Router();
const upload = multer({ dest: "uploads/" });
taskRouter.route("/posttask").post(upload.array("image"), createPostTask);
taskRouter.route("/gettask").get(getPostTasks);
taskRouter.route("/gettaskwithid/:taskId").get(getTaskWithId);
taskRouter.route("/getmultipletask").post(getMultipleTask);
taskRouter
  .route("/getpostedtaskwithemail/:email/:count")
  .get(getPostedTaskWithEmail);
taskRouter.route("/filtersorttask").post(filterSortTask);
export { taskRouter };
