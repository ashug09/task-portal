import mongoose from "mongoose";
import User from "../../models/user/user.model.js";
import SubmitDetails from "../../models/user/submitDetails.model.js";
import PostTask from "../../models/postTask.model.js";
import AWS from "aws-sdk";
import fs from "fs";

const createUser = async (req, res) => {
  try {
    const body = req.body;
    const userId = Math.floor(Math.random() * 1000000000);
    const isUser = await User.findOne({ email: body.email });
    if (isUser) return res.status(409).json({ message: "User already exists" });
    const user = await User.create({ userId, ...body });
    // await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};
const getUser = async (req, res) => {
  try {
    //this function will be used for showing user's top up balance, main balance, posted task, completed task on the profile page
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const updateTopUpBalanceInc = async (req, res) => {
  try {
    // Validate user input
    const { email, topUpBalance } = req.body;
    if (!email || !topUpBalance) {
      throw new Error("Invalid request body");
    }

    // Update user's top up balance
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { topUpBalance } },
      { new: true }
    );

    // Return updated top up balance
    res.status(200).json(user.topUpBalance);
  } catch (error) {
    // Log error and return informative error message
    console.error(error);
    res.status(400).json({ message: "Failed to update top up balance" });
  }
};
const updateTopUpBalanceDec = async (req, res) => {
  try {
    //this function is use to decrease user's top up balance when anyone deducts the balance in their wallet by utilizing the balance in posting task or ads
    const body = req.body;
    const user = await User.findOneAndUpdate(
      { email: body.email },
      { $inc: { topUpBalance: -body.topUpBalance } },
      { new: true }
    );
    res.status(200).json(user.topUpBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const publishedTaskPush = async (req, res) => {
  try {
    //this function is use to push/add published task in user's profile
    const body = req.body;

    const user = await User.findOneAndUpdate(
      { email: body.email },
      { $push: { publishedTask: body.publishedTask } },
      { new: true }
    );
    res.status(200).json(user.publishedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const publishedTaskDelete = async (req, res) => {
  try {
    //this function is use to delete published task in user's profile
    const body = req.body;
    const user = await User.findOneAndUpdate(
      { email: body.email },
      { $pull: { publishedTask: body.publishedTask } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const completedTaskPush = async (req, res) => {
  try {
    //this function is use to push/add completed task in user's profile
    const body = req.body;
    const user = await User.findOneAndUpdate(
      { email: body.email },
      { $push: { completedTask: body.completedTask } },
      { new: true }
    );
    res.status(200).json(user.completedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const mainBalanceInc = async (req, res) => {
  try {
    //this function is use to increase user's main balance when anyone adds the balance to their wallet by completing tasks
    const body = req.body;
    const user = await User.findOneAndUpdate(
      { email: body.email },
      { $inc: { mainBalance: body.mainBalance } },
      { new: true }
    );
    res.status(200).json(user.mainBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const mainBalanceDec = async (req, res) => {
  try {
    //this function is use to decrease user's main balance when anyone deducts the balance from their wallet by withdrawal
    const body = req.body;
    const user = await User.findOneAndUpdate(
      { email: body.email },
      { $inc: { mainBalance: -body.mainBalance } },
      { new: true }
    );
    res.status(200).json(user.mainBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const takenTaskPush = async (req, res) => {
  try {
    //this function is use to push/add taken task in user's profile
    const body = req.body;
    const data = await User.findOneAndUpdate(
      { email: body.email },
      { $push: { taskTaken: body.taskId } },
      { new: true }
    );
    res.status(200).json(data.taskTaken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const createEvaluation = async (req, res) => {
  try {
    const body = req.body;
    // const evaluation = await User.findOneAndUpdate(
    //   { email: body.email },
    //   { $push: { evaluate: body.evaluateDetail } },
    //   { new: true }
    // );
    const evaluation = await User.findOne({ email: body.email });
    const date = new Date();
    evaluation.evaluate.push(body.evaluateDetail);
    await evaluation.save();
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getEvaluation = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Filter the evaluate array to find the evaluation object with the specified taskId
    if (!body.taskId) {
      return res.status(200).json(user.evaluate);
    }
    const matchingEvaluation = user.evaluate.filter(
      (item) => item.taskId == body.taskId
    );
    if (matchingEvaluation.length === 0) {
      return res
        .status(404)
        .json({ message: "Evaluation for taskId not found" });
    }
    res.status(200).json(matchingEvaluation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Filter the evaluate array to find the evaluation object with the specified taskId
    const matchingEvaluation = user.evaluate.filter(
      (item) => item.taskId == body.taskId
    );
    if (matchingEvaluation.length === 0) {
      return res
        .status(404)
        .json({ message: "Evaluation for taskId not found" });
    }
    // Update the evaluation object with the specified taskId
    const evaluationIndex = user.evaluate.findIndex(
      (item) => item.taskId == body.taskId
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const createSubmission = async (req, res) => {
  // AWS Configuration
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  try {
    const s3 = new AWS.S3();
    const body = req.body;
    let imageArray = [];
    const files = req.files;
    const uploadPromises = files.map((file) => {
      const fileContent = fs.readFileSync(file.path);
      const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}/submissions`,
        Key: file.originalname,
        Body: fileContent,
      };
      return s3.upload(params).promise();
    });

    await Promise.all(uploadPromises)
      .then((results) => {
        const imageUrls = results.map((result) => result.Location);
        imageArray.push(...imageUrls);
        // Delete files from uploads folder
        files.forEach((file) => {
          fs.unlinkSync(file.path);
        });
        // res.send(imageArray);
      })
      .catch((error) => {
        console.error("Error uploading files", error);
        res.status(500).send("Error uploading files");
      });

    await SubmitDetails.create({ ...body, upload: imageArray });
    await User.findOneAndUpdate(
      { email: body.userEmail },
      {
        $set: {
          "evaluate.$[element].status.underEvaluation": true,
        },
      },
      {
        arrayFilters: [
          {
            "element.taskId": body.taskId,
          },
        ],
        new: true,
      }
    );
    res.status(201).json({ message: "details submitted successfully" });

    // // Read the image file from the request body
    // const imageFile = req.file;
    // // Generate a unique filename for the image (e.g., using timestamp)
    // const filename = Date.now() + "-" + imageFile.originalname;
    // // Configure parameters for uploading the image to S3
    // const params = {
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: filename, // Set the key (filename) for the uploaded image
    //   Body: fs.createReadStream(imageFile.path), // Readable stream of the image file
    //   ContentType: imageFile.mimetype, // Set the content type of the file
    // };
    // // Upload the image to S3 using the pre-signed URL
    // const uploadResponse = await s3.upload(params).promise();
    // // Delete the temporary file uploaded by multer
    // fs.unlinkSync(imageFile.path);
    // res.json({ imageUrl: uploadResponse.Location });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getSubmissionWithUsers = async (req, res) => {
  try {
    const count = req.params.count;
    const promoterEmail = req.body.promoterEmail;
    const taskId = req.body.taskId;
    const userEmail = req.body.userEmail;
    const userId = req.body.userId;
    if (count == 1) {
      // Find the number of tasks with status = "pending evaluation"
      //count == 1 depicts that response will only have the total number of pending evaluation tasks so that website does not have load, if we send all the evaluation data and then apply arr.length method for counting
      const pendingEvaluationCount = await SubmitDetails.countDocuments({
        promoterEmail: promoterEmail,
        status: "Pending Evaluation",
      });
      res.status(200).json(pendingEvaluationCount);
    } else if (count == 2) {
      try {
        const promoterEmail = req.body.promoterEmail;
        const data = await SubmitDetails.find({
          promoterEmail: promoterEmail,
        }).select("taskId");

        // Get unique task IDs
        const taskIds = data.map((item) => item.taskId);
        const uniqueTaskIds = [...new Set(taskIds)];

        res.status(200).json(uniqueTaskIds);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else if (count == 3) {
      try {
        const body = req.body;
        const data = await PostTask.find({ taskId: { $in: body.taskId } });
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else if (count == 4) {
      try {
        // this will find the report of a particular user, that means submission of a particualr user with the user id & task id
        const data = await SubmitDetails.find({
          taskId: taskId,
          userId: userId,
        });
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else {
      try {
        // Find the submissions with the given promoterEmail
        const data = await SubmitDetails.find({
          promoterEmail: promoterEmail,
          taskId: taskId,
          status: { $eq: "Pending Evaluation" },
          // userId: userId
        });
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateStatus = async (req, res) => {
  try {
    const body = req.body;
    const count = req.params.count;
    const taskId = body.taskId;
    const taskIdStr = taskId.toString();
    if (count == 1) {
      //this fucntion basically will be used by the promoter to set the status of the task (user side) as evaluation done & payment initiated. if the promoter selects the CORRECT button
      try {
        const data = await User.findOneAndUpdate(
          { email: body.userEmail },
          {
            $set: {
              "evaluate.$[element].status.evaluationDone": true,
              "evaluate.$[element].status.paymentInitiated": true,
            },
          },
          {
            arrayFilters: [
              {
                "element.taskId": taskIdStr,
              },
            ],
            new: true,
          }
        );
        const data1 = await SubmitDetails.findOneAndUpdate(
          {
            userId: body.userId,
            taskId: body.taskId,
          },
          {
            $set: {
              status: "correct",
            },
          },
          {
            new: true,
          }
        );
        res.status(201).json({
          message: "details submitted successfully",
          data: data,
          data1: data1,
        });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export {
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
  getEvaluation,
  createSubmission,
  getSubmissionWithUsers,
  updateStatus,
};
