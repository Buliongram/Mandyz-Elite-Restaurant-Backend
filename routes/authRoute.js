import bcryptjs from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const router = express.Router();



router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const userExists = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (userExists)
      return res
        .status(409)
        .json({ error: true, message: "This email already exists" });
    else {
      const salt = await bcryptjs.genSalt(10),
        hashPassword = await bcryptjs.hash(password, salt);

      await prisma.user.create({
        data: {
          firstname,
          lastname,
          email: email.toLowerCase(),
          password: hashPassword,
        },
      });
      return res.status(201).json({
        error: false,
        message: `Welcome to Mandyz Place, ${firstname} ${lastname}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Unable to create your account. Please try again",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        email: true,
        password: true,
        status: true,
      },
    });
    if (!user)
      return res.status(404).json({ error: true, message: "User not found" });
    // else if (user.status === "Pending")
    //   return res.status(401).json({
    //     error: true,
    //     message: "Oops! Your account is pending. Please, verify your email",
    //   });
    else if (user.status === "Suspend")
      return res.status(401).json({
        error: true,
        message:
          "Oops! Your account is suspended. Please, contact admin if this is wrong",
      });
    else {
      const passwordMatch = await bcryptjs.compare(password, user.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ error: true, message: "Invalid credentials" });
      } else {
        const token = jwt.sign(
          {
            id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        delete user.password;
        delete user.status;

        // http only means that only the server can modify the cookie , it preven
        return res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          })
          .status(200)
          .json({
            error: false,
            message: `Welcome back ${user.firstname} ${user.lastname}. Redirecting...`,
            token,
            user,
          });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Unable to process your request. Please try again ",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ error: false, message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Unable to process your request " });
  }
});

export default router;
