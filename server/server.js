const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const protect = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

// CONFIG
dotenv.config();

// DATABASE
connectDB();

const app = express();


// ============================
// MIDDLEWARE
// ============================

app.use(cors());
app.use(express.json());


// ============================
// ROUTES
// ============================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));


// ============================
// TEST ROUTES
// ============================

app.get("/", (req, res) => {
  res.send("API Running...");
});


app.get("/api/protected", protect, (req, res) => {

  res.json({
    message: "Protected route working",
    user: req.user,
  });

});


app.get(
  "/api/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {

    res.json({
      message: "Welcome Admin",
    });

  }
);


// ============================
// SERVER
// ============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});