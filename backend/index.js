import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
const app = express();
configDotenv();
import ConnectToMongo from "./config/db.js";
import userRoutes from "./routes/userRoute.js"
import productRoutes from "./routes/productRoute.js"
import orderRoutes from "./routes/orderRoute.js"

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
ConnectToMongo();
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
