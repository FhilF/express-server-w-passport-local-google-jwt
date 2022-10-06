"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var UserSchema = new Schema({ name: { type: String, required: true } });

module.exports = mongoose.model("Role", UserSchema);
