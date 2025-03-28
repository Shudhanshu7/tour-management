import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//user registeration
// user registration
export const register = async (req, res) => {
  try {
    // Hashing password
    const salt = bcrypt.genSaltSync(10); // Use genSaltSync instead of getSaltSync
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash, // Use the hashed password instead of the plain text
      photo: req.body.photo,
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "successfully created" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res
      .status(500)
      .json({ success: false, message: "failed to create, try again" });
  }
};


//user login
// user login
export const login = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });

    // If user doesn't exist
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // If user exists, check the password
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }

    const { password, role, ...rest } = user._doc;

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Set token in the browser cookies and send the response to the client
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Correctly set expiration
      })
      .status(200)
      .json({
        success: true,
        message: "Successfully logged in",
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};

