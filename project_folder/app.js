require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const employeeRoutes = require('./routes/employee'); // Import routes

const app = express();

connectDB();

app.use(express.json());

app.use('/api', employeeRoutes);


const PORT = process.env.PORT || 3000;
const db_host = process.env.DB_HOST
const db_port = process.env.DB_PORT
const db_name = process.env.DB_NAME

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));