import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import axios from "axios";

const router = express.Router();

function cuid(length) {
  let result = "";
  const text = "abcdefghijklmnopqrstuvwxyz1234567890";
  const textlength = text.length;
  for (let i = 0; i < length; i++) {
    result += text.charAt(Math.floor(Math.random() * textlength));
  }
  return result;
}

const PAYSTACK_SECRET_KEY = "sk_test_d8b2b98cd7a014e828fd33d06655a8db140c06f3";

router.post("/saveOrder", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized action. Please log in." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userid = decoded.user_id || decoded.id;
  const { orderData, checkoutType, transactionRef } = req.body;

  if (!orderData || !transactionRef) {
    return res.status(400).json({
      error: true,
      message: "Order data and transaction reference are required.",
    });
  }

  try {
    // Step 1: Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${transactionRef}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data;
    if (!paymentData.status || paymentData.data.status !== "success") {
      return res
        .status(400)
        .json({ error: true, message: "Payment verification failed." });
    }

    // Step 2: If payment is verified, save the order to the database
    const orderId = cuid(20); // Generate unique order ID
    const savedOrder = await prisma.order.create({
      data: {
        order_id: orderId,
        ownerId: userid,
        orderData: JSON.stringify(orderData),
        checkoutType,
        paymentMethod: paymentData.data.channel,
      },
    });

    res
      .status(201)
      .json({ message: "Order saved successfully", order_id: orderId });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Error saving order" });
  }
});

router.get("/getOrders", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized action. Please log in." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userid = decoded.user_id || decoded.id;
  try {
    // const orders = await prisma.order.findMany({
    //   where: { ownerId: userid },
    //   select: {
    //     orderData: true,
    //     ownerId: true,
    //   },
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    // });
    const findOrder = await prisma.order.findMany({
      where: {
        ownerId: userid,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ order: findOrder });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve orders" });
  }
});

router.get("/findOrder", async (req, res) => {
  const { orderId } = req.query;
  try {
    const findOrder = await prisma.order.findFirst({
      where: { order_id: orderId },
    });
    if (!findOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order: findOrder });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res
      .status(500)
      .json({ success: false, message: "An Unknown Errow occured" });
  }
});

router.post("/cancelOrder", async (req, res) => {
  const orderId = req.body.order_id;
  try {
    const findOrder = await prisma.order.findFirst({
      where: {
        order_id: orderId,
      },
    });

    if (!findOrder) {
      return res.status(404).json({
        success: false,
        message: "An unknown error occured.",
      });
    }
    const cancelOrder = await prisma.order.update({
      where: {
        order_id: orderId,
      },
      data: {
        status: "Cancelled",
      },
    });
    if (cancelOrder) {
      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
