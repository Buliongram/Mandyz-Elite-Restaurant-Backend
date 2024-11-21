import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const router = express.Router();

router.post("/createAddress", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized action. Please log in." });
  }

  const {
    firstname,
    lastname,
    primaryPhone,
    secondaryPhone,
    region,
    address,
    information,
  } = req.body;

  console.log({ firstname, lastname, primaryPhone, secondaryPhone, region });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.user_id || decoded.id; // Adjust based on your token structure

    if (!userid) {
      return res
        .status(400)
        .json({ message: "Unauthorized action. Please log in." });
    }

    await prisma.address.create({
      data: {
        ownerId: userid.toString(), // Ensure userid is a string
        firstname,
        lastname,
        primaryPhone,
        secondaryPhone,
        region,
        address,
        information,
      },
    });

    return res.status(201).json({
      error: false,
      message: "Address created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Unable to save your address. Please try again",
    });
  }
});

router.get("/getUserAddress", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.user_id || decoded.id;

    if (!userid) {
      return res
        .status(400)
        .json({ message: "Unauthorized action. Please log in." });
    }

    const findUserAddress = await prisma.address.findFirst({
      where: {
        ownerId: userid.toString(),
      },
    });

    if (!findUserAddress) {
      return res.status(400).json({ message: "Address not found" });
    }
    return res.json({ address: findUserAddress });
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
});

router.post("/updateAddress", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized action. Please log in." });
  }

  const {
    firstname,
    lastname,
    primaryPhone,
    secondaryPhone,
    region,
    address,
    information,
  } = req.body;

  console.log({ firstname, lastname, primaryPhone, secondaryPhone, region });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.user_id || decoded.id; // Adjust based on your token structure

    if (!userid) {
      return res
        .status(400)
        .json({ message: "Unauthorized action. Please log in." });
    }

    await prisma.address.update({
      where: { ownerId: userid.toString() },
      data: {
        firstname,
        lastname,
        primaryPhone,
        secondaryPhone,
        region,
        address,
        information,
      },
    });

    return res.status(201).json({
      error: false,
      message: "Address updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Unable to update your address. Please try again",
    });
  }
});

export default router;
