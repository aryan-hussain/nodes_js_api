const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../swagger.json");
const Model = require("../Model/model");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("../middlewares/auth");

const router = express.Router();
const mongoString = 'mongodb+srv://aryanhussain78668:aryanhussain102@cluster0.cwmdqkx.mongodb.net/test';
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log("error");
});
database.once("connected", () => {
  console.log("The MongoDb database connection success!");
});
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
function paginatedResults() {
  return async (req, res, next) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const skipIndex = (page - 1) * limit;
    const data = {};
    try {
      data.results = await Model.find()
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = { page_no: page, data };
      next();
    } catch (e) {
      res.status(500).json({ message: "Error Occured" });
    }
  };
}
router.get("/users", paginatedResults(), (req, res) => {
  const result = res.paginatedResults;
  res.json({ Total: result.data.results.length, result });
});
router.post("/post", async (req, res) => {
  let address = req.body.address;
  let skills = req.body.skills;
  let phone = req.body.phone;
  let name = req.body.name;
  let hobby = req.body.hobby;
  let email = req.body.email;
  let username = req.body.username;
  let qualifications = req.body.qualifications;
  let marksObtained = req.body.marksObtained;
  const data = new Model({
    name: name,
    username: username,
    email: email,
    phone: phone,
    hobby: hobby,
    skills: skills,
    qualifications: qualifications,
    address: address,
    marksObtained: marksObtained,
  });

  try {
    const results = await data.save();
    res
      .status(200)
      .json({ Message: "User has been registered successfully!", results });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/comment", async (req, res) => {
  const comment = new Model({
    comment: req.body.comment,
  });
  try {
    const saveComment = await comment.save();
    res.status(200).json({ Message: "Comment posted success", saveComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/getAllUsers", async (req, res) => {
  try {
    const data = await Model.find();
    const totalCounts = data.length;
    // res.json({ total: totalCounts, data });
    res.status(200).json({
      Message: "The data has been fetched successfully!",
      total: totalCounts,
      results: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getById/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const data = await Model.findById(id);
    res.status(200).json({ message: "Data fetched success", results: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch("/update", async (req, res) => {
  try {
    let id = req.body.id;
    let phone = req.body.phone;
    let name = req.body.name;
    let hobby = req.body.hobby;
    let address = req.body.address;
    let skills = req.body.skills;
    let qualifications = req.body.qualifications;
    let marksObtained = req.body.marksObtained;
    const updatedData = {
      phone: phone,
      name: name,
      hobby: hobby,
      address: address,
      qualifications: qualifications,
      skills: skills,
      marksObtained: marksObtained,
    };
    const options = { new: true };
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    res
      .status(200)
      .json({ Message: "The data has been updated!", results: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    // let id = req.query.id;
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send({ message: `The user ${data.username} has been deleted!` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/deleteAll", async (req, res) => {
  try {
    await Model.deleteMany();
    res.status(200).json({ message: "All the users have been deleted!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/filter", async (req, res) => {
  try {
    const data = await Model.find();
    const filter = req.query;
    const results = data.filter((user) => {
      let isValid = true;
      for (key in filter) {
        // isValid = isValid && user[key] == filters[key];
        isValid =
          isValid &&
          user[key]
            ?.toLocaleLowerCase()
            .includes(filter[key].toLocaleLowerCase());
      }
      return isValid;
    });
    res.send({
      Items_found: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/sort", async (req, res) => {
  try {
    const sort = req.query.sort;
    const data = await Model.find();
    if (sort.toLocaleLowerCase() === "ascending") {
      res.json({ Total: data.length, data });
    } else if (sort.toLocaleLowerCase() === "descending") {
      const descending_order = data.reverse();
      res.json({ Total: descending_order.length, descending_order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/user/generateToken", (req, res) => {
  // Validate User Here
  // Then generate JWT Token

  let jwtSecretKey = db.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
  };

  const token = jwt.sign(data, jwtSecretKey);

  res.send(token);
});
router.get("/user/validateToken", (req, res) => {
  // Tokens are generally passed in the header of the request
  // Due to security reasons.

  let tokenHeaderKey = db.TOKEN_HEADER_KEY;
  let jwtSecretKey = db.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.send("Successfully Verified");
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});
router.post("/register", async (req, res) => {
  let username = req.body.username;
  let name = req.body.name;
  let password = req.body.password;
  let email = req.body.email;
  let phone = req.body.phone;
  const newuser = new Model({
    name: name,
    username: username,
    email: email,
    phone: phone,
    password: password,
  });
  let jwtSecretKey = 'test';
  let data = {
    time: Date(),
    userId: 12,
  };

  const token = jwt.sign(password, jwtSecretKey);
  try {
    const results = await newuser.save();
    res.status(200).json({
      Message: "User has been registered successfully!",
      results,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login ------------------------------------------
router.post("/api/login", function (req, res) {
  let token = req.cookies.auth;
  //we check whether a user is already logged-in or not by using findByToken function, if not error will be shown to user
  User.findByToken(token, (err, user) => {
    if (err) return res(err);
    if (user)
      return res.status(400).json({
        error: true,
        message: "Sorry you are alrady logged-in",
      });
    else {
      Model.findOne(
        {
          email: req.body.email,
        },
        function (err, user) {
          if (!user)
            return res.json({
              isAuth: false,
              message: " Auth failed ,email not found",
            });
          //if user exists then we will passwords using comparepassword function
          Model.comparepassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
              return res.json({
                isAuth: false,
                message: "password dosen't match",
              });
            //User will be successfully logged in using our API and a token will be generated in the database.
            user.generateToken((err, user) => {
              if (err) return res.status(400).send(err);
              res.cookie("auth", user.token).json({
                isAuth: true,
                id: user._id,
                email: user.email,
                token: user.token,
              });
            });
          });
        }
      );
    }
  });
});

router.post("/login", async (req, res) => {
  let password = req.body.password;
  let email = req.body.email;

  try {
    const emailFound = await Model.findOne({ email: email });
    const passFound = await Model.findOne({ password: password });
    if (!emailFound) {
      res.send({ message: "Email not Found!" });
    }
    if (!passFound) {
      res.send({ message: "Password Incorrect!" });
    }
    // if (emailFound && passFound) {
    //   res.status(200).json({ message: "Login Success!" });
    // }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/`, router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.listen(process.env.PORT || 3001, () => {
  console.log("The server started on port: ", 3001);
});
