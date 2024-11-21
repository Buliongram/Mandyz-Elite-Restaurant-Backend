import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
dotenv.config();

import authRoute from "./routes/authRoute.js";
import addressRoute from "./routes/addressRoute.js";
import orderRoute from "./routes/orderRoute.js";
import settingsRoute from "./routes/settingsRoute.js";

const app = express();

app.use(cookieParser());
app.use(express.json({ urlencoded: 40867 }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/address", addressRoute);
app.use("/order", orderRoute);
app.use("/settings", settingsRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
