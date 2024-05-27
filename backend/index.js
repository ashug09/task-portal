import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(app.listen(process.env.PORT || 16023, () => {
    console.log(`server running on port ${process.env.PORT || 16023}`);
    
  }))
  .catch((err) =>
    console.log("error occured at index.js (entry point): " + err)
  );
