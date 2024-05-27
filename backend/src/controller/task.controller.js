import PostTask from "../models/postTask.model.js";
import AWS from "aws-sdk";
import fs from "fs";

const createPostTask = async (req, res) => {
  // AWS Configuration
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  try {
    const postTask = req.body;
    // console.log(req)
    if (
      !postTask.title ||
      !postTask.description
      //   !postTask.user
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const s3 = new AWS.S3();
    let imageArray = [];
    const files = req.files;
    const uploadPromises = files.map((file) => {
      const fileContent = fs.readFileSync(file.path);
      const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}/promotions`,
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

    const newPostTask = await PostTask.create({
      ...postTask,
      upload: imageArray,
    });
    res.status(201).json(newPostTask);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const getPostTasks = async (req, res) => {
  try {
    const postTasks = await PostTask.find();
    res.status(200).json(postTasks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTaskWithId = async (req, res) => {
  try {
    // const taskId = req.body.taskId;
    const taskId = req.params.taskId;
    const task = await PostTask.find({ taskId });
    if (task === null || !task)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getMultipleTask = async (req, res) => {
  try {
    const taskIds = req.body.taskIds;
    // Convert taskIds to ObjectId type (if they are not already)
    const objectIdTaskIds = taskIds.map((id) => mongoose.Types.ObjectId(id));
    const task = await PostTask.find({ taskId: { $in: objectIdTaskIds } });
    if (task === null || !task)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPostedTaskWithEmail = async (req, res) => {
  //this function will get all the tasks posted by the promoter by using the promoter's email id
  //this function is mainly for the promoter's dashboard
  try {
    const email = req.params.email;
    const count = req.params.count;
    if (count == 1) {
      try {
        const value = await PostTask.countDocuments({ email: email });
        res.status(200).json(value);
      } catch (error) {
        res
          .status(400)
          .json({ message: "error while counting post documents" });
      }
    } else {
      const task = await PostTask.find({ email: email });
      if (task === null || !task)
        return res.status(404).json({ message: "Task not found" });
      res.status(200).json(task);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const filterSortTask = async (req, res) => {
  try {
    const body = req.body;
    if (
      (body.parameter !== "" ||
        body.categories !== "" ||
        body.rewards !== "") &&
      ((body.task_id !== "" && body.string_match !== "") || body.sort !== "")
    ) {
      return res.status(400).json({ message: "Please select only one filter" });
    }
    const query = {
      $and: [
        // Filter by selected categories
        {
          selectedCategory:
            body.categories.length != 0
              ? { $in: body.categories }
              : { $nin: body.categories },
        },
        // Filter by repeat option
        {
          repeat:
            body.parameter != ""
              ? body.parameter === "One Time"
                ? { $in: ["1"] }
                : { $nin: ["1"] }
              : { $nin: [""] },
        },
        //Filter by rewards that is greater than the given amount
        {
          amount:
            body.rewards != ""
              ? parseFloat(body.rewards) != 0
                ? { $gte: parseFloat(body.rewards) }
                : { $nin: [""] }
              : { $nin: [""] },
        },
        //Filter by task Id
        {
          taskId:
            body.task_id != ""
              ? { $in: parseInt(body.task_id) }
              : { $nin: body.task_id },
        },
        { title: { $regex: body.string_match, $options: "i" } },
      ],
    };
    const sort = {};
    if (body.sort === "Most Recent") {
      sort.createdAt = -1; // Sort by createdAt field in descending order
    } else if (body.sort === "Oldest") {
      sort.createdAt = 1; // Sort by createdAt field in ascending order
    } else if (body.sort === "Price: High to Low") {
      sort.amount = -1; // Sort by amount field in descending order
    } else if (body.sort === "Price: Low to High") {
      sort.amount = 1; // Sort by amount field in ascending order
    }
    const task = await PostTask.find(query).sort(sort);
    if (task === null || !task)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export {
  createPostTask,
  getPostTasks,
  getTaskWithId,
  getMultipleTask,
  getPostedTaskWithEmail,
  filterSortTask,
};
