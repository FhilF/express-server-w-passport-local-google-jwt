const LocalStrategy = require("passport-local").Strategy,
  z = require("zod");

const User = require("../models/User"),
  Role = require("../models/Role");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(function (username, password, callback) {
      User.findOne({ username }, (err, user) => {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }
        if (!user.comparePassword(password)) {
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }

        return user.populate("roles", "name -_id").then((data) => {
          return callback(null, user);
        });
      });
    })
  );
};
