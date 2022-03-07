require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const app = express();
app.use(express.json());

//DB configuration.
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@cluster0.gwyot.mongodb.net/Cluster0?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Connect to mongoDB
connectDB();

//App port
const PORT = 3000;

// App routers config
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

//Start App.
app.listen(PORT, () => {
  console.log(`App listening on port:${PORT}`);
});
