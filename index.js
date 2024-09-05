const express = require("express");
const mongosoe = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
// const cors = require("cors");


const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

mongosoe
  .connect(process.env.uri, {})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// mongo schema
const registerSchema = new mongosoe.Schema({
  name: String,
  email: String,
  password: String,
});
const registration = mongosoe.model("registration", registerSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await registration.findOne({ email: email });
    // check for existing user
    if (!existUser) {
      const registrationData = new registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.sendFile("/success");
      console.log(registrationData)
    } else {
      console.log("user already exists");
      res.redirect("/success");
    }
  } catch (error) {
    console.error(error);
    res.sendFile(error);
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/done.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
