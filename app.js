require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const User = require("./models/User");

/**
 * Controllers (route handlers).
 */
const infectionController = require("./controllers/infection");
const userController = require("./controllers/user");

const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { WEB_PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))

app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/statistics", (req, res) => {
  res.render("statistics");
});

app.get("/join", (req, res) => {
  res.render('create-user', { errors: {} })
});
app.post("/join", userController.create);

app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);

app.get("/tastings", infectionController.list);
app.get("/tastings/delete/:id", infectionController.delete);


app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});