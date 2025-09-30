import User from "../models/customer.js";
import OTP from "../models/otp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Utility: Check if user is admin
export function isAdmin(req) {
  return req.user && req.user.memberRole === "admin";
}


export function getUserRole(req) {
  const allowedRoles = [
    "member",
    "manager",
    "chairman",
    "secretary",
    "treasurer",
    "admin",
  ];

  if (req.user && allowedRoles.includes(req.user.memberRole)) {
    return req.user.memberRole;
  }

  return null; // or "guest" if you want a default
}


// Utility: Generate next User ID
async function generateUserId() {
  const lastUser = await User.find().sort({ createdAt: -1 }).limit(1);
  if (lastUser.length > 0) {
    const lastId = parseInt(lastUser[0].userId.replace("USR-", ""));
    return "USR-" + String(lastId + 1).padStart(4, "0");
  }
  return "USR-0001";
}

// ✅ Create User
export async function createUser(req, res) {
  try {
    const { name, nameSinhala, mobile, email, password, memberRole, isActive, image } = req.body;

    if (role === "admin" && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ message: "Only admins can create another admin user." });
    }

    if (!req.user) {
      return res.status(403).json({ message: "Please login first to add users." });
    }

    const newUserId = await generateUserId();
    const hashedPassword = bcrypt.hashSync(process.env.JWT_KEY + password, 10);

    const user = new User({
      userId: newUserId,
      name,
      nameSinhala,
      mobile,
      email,
      password: hashedPassword,
      memberRole,
      isActive,
      image,
    });

    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

// ✅ Login User
export async function loginUsers(req, res) {
  const { userId, email, password } = req.body;

  if (!password || (!userId && !email)) {
    return res.status(400).json({ message: "User ID or Email and password are required" });
  }

  try {
    const user = await User.findOne({
      $or: [{ customerId: userId }, { email }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = bcrypt.compareSync(process.env.JWT_KEY + password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        userId: user.customerId,  
        email: user.email,
        nameSinhala: user.nameSinhala,
        nameEnglish: user.name,
        memberRole: user.memberRole
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", 
      token, 
      memberRole: user.memberRole, 
      userId: user.customerId,
      nameSinhala: user.nameSinhala,
      nameEnglish: user.name,
     });
  } catch (err) {
    console.error("Login error:", err); // important for debugging
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}


// ✅ Delete User
export async function deleteUser(req, res) {
  if (!isAdmin(req)) return res.status(403).json({ message: "You are not authorized to delete user" });

  try {
    const result = await User.deleteOne({ userId: req.params.userId });
    if (result.deletedCount === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
}

// ✅ Update User
export async function updateUser(req, res) {
  if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

  try {
    const { customerId } = req.params;
    const result = await User.updateOne({ customerId }, req.body);
    if (result.matchedCount === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
}

// ✅ Get All Users
export async function getUsers(req, res) {
  // if (!isAdmin(req)) return res.status(403).json({ message: "Unauthorized access" });

  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
}

// ✅ Get Authenticated User
export function getUser(req, res) {
  if (!req.user) return res.status(403).json({ message: "Unauthorized" });

  const { customerId, email, nameSinhala, name, memberRole } = req.user;
  res.json({ customerId, email, nameSinhala, name, memberRole});
}

// ✅ Google Login
export async function loginWithGoogle(req, res) {
  const token = req.body.accessToken;
  if (!token) return res.status(400).json({ message: "Access token is required" });

  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { email, userId, nameEnglish, nameSinhala, role } = response.data;
    let user = await User.findOne({ email });

    if (!user) {
      const newUserId = await generateUserId();
      user = new User({
        userId: newUserId,
        email,
        nameSinhala,
        nameEnglish,
        role: "member",
        isActive: true,
        image: picture,
        password: undefined,
        isGoogleUser: true
      });
      await user.save();
    }

    const jwtToken = jwt.sign({
      userId: user.customerId,
      email: user.email,
      nameSinhala: user.nameSinhala,
      nameEnglish: user.name,
      role: user.memberRole,
    }, process.env.JWT_KEY, { expiresIn: "1d" });

    res.json({ message: "Login successful", token: jwtToken, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
}

// ✅ Email Transporter
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send OTP
export async function sendOTP(req, res) {
  const { email, userId, mobile } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // const user = await User.findOne({ email });
    // if (!user) return res.status(404).json({ message: "User not found" });

    await OTP.deleteMany({ email });
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    await new OTP({ email, otp: randomOTP }).save();

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password - TSDF",
      text: `Your password reset OTP is: ${randomOTP}. This OTP will expire in 10 minutes. 
            Mobile number: ${mobile}
            User ID: ${userId}`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
}

// ✅ Reset Password
export async function resetPassword(req, res) {
  const { email, userId, newPassword } = req.body;
  try {
    // const otpDoc = await OTP.findOne({ email });
    // if (!otpDoc) return res.status(404).json({ message: "No OTP requests found" });
    // if (String(otp) !== String(otpDoc.otp)) return res.status(403).json({ message: "Invalid OTP" });

    // await OTP.deleteMany({ email });
    const hashedPassword = bcrypt.hashSync(process.env.JWT_KEY + newPassword, 10);
    await User.updateOne({ customerId: userId }, { password: hashedPassword });

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
}