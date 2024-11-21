import express from "express";
import { prisma } from "../config/prisma.js";
const router = express.Router();
import { randomUUID } from "crypto";
import fs from "fs";
import * as url from "url";
import path from "path";
import jwt from "jsonwebtoken";
import multer from "multer";

const dirname = url.fileURLToPath(new URL("../../", import.meta.url));
const uploadDir = `${dirname}/client/public/listings`;
const upload = multer({ dest: uploadDir });

//get all listing
router.get("/", async (req, res) => {
  try {
    const listing = await prisma.listing.findMany({
      where: {
        status: "Available",
      },
      include: {
        owner: { select: { firstname: true, lastname: true, image: true } },
      },
    });

    return res.status(200).json({ error: false, message: "", listing });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Unable to process your request. Please try again ",
    });
  }
});

// get single listing

router.get("/single", async (req, res) => {
  const id = req.params;
  try {
    const listing = await prisma.listing.findMany({
      where: {
        status: "Available",
        listing_id: id,
      },
      include: {
        owner: { select: { firstname: true, lastname: true, image: true } },
      },
    });

    return res.status(200).json({ error: false, message: "", listing });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Unable to process your request. Please try again ",
    });
  }
});

// create listing

router.post("/create", async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    state,
    country,
    bedroom,
    bathroom,
    guestroom,
    status,
    featured,
    images,
  } = req.body;

  try {
    const token = req.cookies.token;

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken)
      return res.status(401).json({
        error: true,
        message: "You are not allowed to perform this action.Please login",
      });
    else {
      const user = jwt.decode(token, process.env.JWT_SECRET);
      console.log({token, user})
      // console.log(user.isAdmin);
      if (!user.isAdmin) {
        return res.status(401).json({
          error: true,
          message: "Error. Only admins are allowed to create listings",
        });
      } else {
        console.log("request came here");
        await prisma.listing.create({
          data: {
            title,
            description,
            price,
            address,
            state,
            country,
            bedroom: +bedroom,
            bathroom: +bathroom,
            guestroom: +guestroom,
            status,
            featured: featured === "Yes" ? true : false,
            images: JSON.stringify(images),
            ownerId: user.id,
          },
        });

        return res.status(201).json({
          error: false,
          message: `New listing created successfully`,
        });
      }
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      message: "Unable to process your request. Please try again ",
    });
  }
});

// edit listing

// delete listing

export default router;
