import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: "https://via.placeholder.com/150",
  }
}, { timestamps: true });

  userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, 10);
    next();
  })

  userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
  }

  userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        name: this.name
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    )
  };

  userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      {
        _id: this._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    )
  }

const User = mongoose.model("User", userSchema);

export default User;
