import {
  createUser,
  getUser,
  updateTopUpBalanceInc,
  updateTopUpBalanceDec,
  publishedTaskPush,
  publishedTaskDelete,
  completedTaskPush,
  mainBalanceInc,
  mainBalanceDec,
  takenTaskPush,
  createEvaluation,
  createSubmission,
  getEvaluation,
  getSubmissionWithUsers,
  updateStatus,
} from "../controller/user/user.controller.js";
import {
  createMyWall,
  showMyWall,
  updateMyWall,
} from "../controller/user/myWall.controller.js";
import {
  createPersonal,
  getPersonal,
  updatePersonal,
} from "../controller/user/personal.controller.js";
import { Router } from "express";
import multer from "multer";

const userRouter = Router();

userRouter.route("/createuser").post(createUser);
userRouter.route("/getuser").post(getUser);
userRouter.route("/updatetopupbalanceinc").post(updateTopUpBalanceInc);
userRouter.route("/updatetopupbalancedec").post(updateTopUpBalanceDec);
userRouter.route("/publishedtaskpush").post(publishedTaskPush);
userRouter.route("/publishedtaskdelete").post(publishedTaskDelete);
userRouter.route("/completetaskpush").post(completedTaskPush);
userRouter.route("/mainbalanceinc").post(mainBalanceInc);
userRouter.route("/mainbalancedec").post(mainBalanceDec);
userRouter.route("/createmywall").post(createMyWall);
userRouter.route("/createPersonal").post(createPersonal);
userRouter.route("/getPersonal").post(getPersonal);
userRouter.route("/updatePersonal").post(updatePersonal);
userRouter.route("/showMyWall").post(showMyWall);
userRouter.route("/updateMyWall").post(updateMyWall);
userRouter.route("/takentaskpush").post(takenTaskPush);
userRouter.route("/createevaluation").post(createEvaluation);
userRouter.route("/getevaluation").post(getEvaluation);

const upload = multer({ dest: "uploads/" });
userRouter
  .route("/createsubmission")
  .post(upload.array("image"), createSubmission);
userRouter.route("/getsubmissionwithuser/:count").post(getSubmissionWithUsers);
userRouter.route("/updatestatus/:count").post(updateStatus);
export { userRouter };
