import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Environment variables
dotenv.config();

// Configure the app
const app = express();

// Read data through the body
app.use(express.json());

// Connect to the database
db();

// Configure CORS
const whiteList =
  process.argv[2] === "--postman"
    ? [process.env.FRONTEND_URL, undefined]
    : [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      // Allows the connection
      callback(null, true);
    } else {
      // Does not allow connection
      callback(new Error("Error de CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Define a route
app.use("/api/services", servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes );
app.use("/api/users", userRoutes );

// Define a port
const PORT = process.env.PORT || 4000;

// Start the app
app.listen(PORT, (req, res) => {
  console.log(
    colors.green("El servidor se está ejecutando en el puerto: "),
    colors.blue.bold(PORT)
  );
});
