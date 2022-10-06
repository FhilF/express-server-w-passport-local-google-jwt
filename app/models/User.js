const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

const config = require("../config");

const { Schema } = mongoose,
  SALT_WORK_FACTOR = 10;

const UserSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9_]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 60,
    },
    name: String,
    avatar: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    bio: String,
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    // messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

UserSchema.methods.register = (newUser, callback) => {
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return err;
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) return err;
      // set pasword to hash
      newUser.password = hash;

      newUser
        .save()
        .then((res) => callback(null, res))
        .catch((err) => callback(err, null));
    });
  });
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      // expiresIn: "12h",
      id: this._id,
      provider: this.provider,
      username: this.username,
      aud: config.audience,
      iss: config.audience,
    },
    config.jwtSecretKey
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
