const passport = require("passport"),
  { faker } = require("@faker-js/faker");

const { registerSchema } = require("../scripts/validators"),
  config = require("../config"),
  db = require("../models"),
  User = db.user,
  Role = db.role;

exports.signup = async (req, res, next) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(500).send({
      message: `${validation.error.issues[0].path[0]}: ${validation.error.issues[0].message}`,
    });
  }
  const { email, password, name, username } = req.body;

  try {
    const test = await User.find().or([{ email }, { username }]);
    if (test.length > 0) {
      if (email === test[0]._doc.email)
        return res
          .status(400)
          .send({ key: "email", message: "Email is already in use" });
      if (username === test[0]._doc.username)
        return res
          .status(400)
          .send({ key: "username", message: "Username is already in use" });
    }

    const role = await Role.findOne({ name: "user" });
    const newUser = await new User({
      provider: "email",
      roles: [role.id],
      email,
      password,
      username,
      name,
      avatar: faker.image.avatar(),
    });

    newUser.register(newUser, (err, user) => {
      if (err) {
        return res.status(500).send({ message: "Internal Server Error" });
      }

      delete user._doc.provider;
      delete user._doc.password;
      delete user._doc.__v;
      return res.status(200).send({ user: user._doc });
    });
  } catch (error) {
    return res.json({ error });
  }
};

exports.signin = (req, res, next) => {
  const user = req.user;
  req.logIn(user, { session: true }, (err) => {
    if (err) {
      return next(err);
    }

    const token = user.generateJWT();
    res.cookie("jwt", token, {
      // maxAge: 900000,
      httpOnly: true,
      expires: new Date(Date.now() + config.cookieJwtExpiration),
    });
    return res.status(200).send({ user });
  });
};

exports.signout = (req, res, next) => {
  req.session.destroy(function () {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};
