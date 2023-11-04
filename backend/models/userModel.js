import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Defining avatar schema seperately for readibility
const avatarSchema = new Schema({
  public_id: {
    type: String,
    default: "default_public_id", // You can set a default value if needed
  },
  secure_url: {
    type: String,
    default: "https://picsum.photos/200/300?grayscale", // Default URL for the avatar
  },
});

// Defining the user schema in a seperate object for more readibility and clean code
const userSchema = {
  userName: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
  },
  avatar: avatarSchema,
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
};

// Creating a Mongoose model ("User") based on the user schema for the "Telefaces_Users" collection
const schema = new Schema(userSchema);

// Defining an action of password getting hashed before it gets saved in the db
schema.pre("save", async function (next) {
  // Checking if the password field has been modified before hashing and saving
  if (!this.isModified(this.password)) {
    return next();
  } else {
    try {
      // hashing using bcrypt
      this.password = await bcrypt.hash("password", 10);
      return next();
    } catch (error) {
      return next(error);
    }
  }
});

// Modelling the userSchema
const User = mongoose.model("Telefaces_Users", schema);
// exporting the user Model
export default User;
