import bcryptjs from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const router = express.Router();

router.get("/getUser", async (req, res) => {
  const token = req.cookies.token; // Adjust if the cookie name differs
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized action. Please log in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.user_id || decoded.id;
    if (!userid) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized action. Please log in.",
      });
    }
    const FindUser = await prisma.user.findFirst({
      where: {
        user_id: userid,
      },
    });
    if (!FindUser) {
      return res.status(404).json({
        error: true,
        message: "User not found.",
      });
    }
    return res.json({ user: FindUser });
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
});

router.post("/changePassword", async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check for a valid new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        error: true,
        message: "New password must be at least 8 characters long.",
      });
    }
    // Check for a valid confirm password
    if (!confirmPassword || newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords do not match",
      });
    }

    const token = req.cookies.token; // Adjust if the cookie name differs
    if (!token) {
      return res.status(401).json({ error: true, message: "Unauthorized" });
    }
    // Decode the token to get user email
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: true, message: "Invalid token" });
    }

    const UserEmail = decoded.email;
    if (!UserEmail) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized access. Please log in.",
      });
    }

    // Find the user in the database
    const FindUser = await prisma.user.findFirst({
      where: {
        email: UserEmail.toLowerCase(),
      },
    });
    if (!FindUser) {
      return res.status(404).json({
        error: true,
        message: "User not found.",
      });
    }

    // Check if the old password is correct
    const isValidPassword = await bcryptjs.compare(
      oldPassword,
      FindUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        error: true,
        message: "Invalid old password supplied.",
      });
    }

    const samePassword = await bcryptjs.compare(newPassword, FindUser.password);
    if (samePassword) {
      return res.status(401).json({
        error: true,
        message: "New password must be different from current password.",
      });
    }

    // Hash the new password and update the user
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);
    console.log(hashPassword);

    await prisma.user.update({
      where: { user_id: FindUser.user_id }, // Use the unique identifier for updating
      data: { password: hashPassword }, // Update the password
    });

    return res.json({
      error: false,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      message: "Unable to process your request. Please try again later.",
    });
  }
});

router.post("/updateInfo", async (req, res) => {
  try {
    const { firstname, lastname } = req.body;

    const token = req.cookies.token; // Adjust if the cookie name differs
    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.user_id || decoded.id;
    if (!userid) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized access. Please log in.",
      });
    }

    // Find the user in the database
    const FindUser = await prisma.user.findFirst({
      where: {
        user_id: userid,
      },
    });
    if (!FindUser) {
      return res.status(404).json({
        error: true,
        message: "User not found.",
      });
    }

    await prisma.user.update({
      where: { user_id: userid },
      data: {
        firstname: firstname.toLowerCase(),
        lastname: lastname.toLowerCase(),
      },
    });

    console.log({ firstname, lastname });

    return res.json({
      error: false,
      message: "Profile Information updated successfully",
    });
  } catch (error) {
    console.error("Error processing your request:", error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      message: "Unable to process your request. Please try again later.",
    });
  }
});

export default router;
