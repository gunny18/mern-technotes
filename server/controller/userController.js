import { User } from "../models/User.js";
import { Note } from "../models/Note.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
      return res.status(400).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createNewUser = async (req, res, next) => {
  try {
    const { username, password, roles } = req.body;
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate Username" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = { username, password: hashedPassword, roles };
    const user = await User.create(createdUser);
    if (user) {
      return res.status(201).json({ message: `New user ${username} created` });
    } else {
      res.status(400).json({ message: "Invalid User data received" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { username, id, password, roles, active } = req.body;
    if (
      !username ||
      !id ||
      !Array.isArray(roles) ||
      !roles.length ||
      typeof active !== "boolean"
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    const duplicate = await User.findOne({ username });
    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({ message: "User already exists" });
    }
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();
    res.json({ message: `Updated user ${updatedUser.username}` });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID required" });
    }

    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
      return res.status(400).json({ message: "User has assigned notes" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({
      message: `Username ${user.username} with ID ${user._id} deleted`,
    });
  } catch (error) {
    next(error);
  }
};
