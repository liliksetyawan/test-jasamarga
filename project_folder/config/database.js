const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres", // Change to 'mysql' or other dialect if needed
    logging: false, // Set to true for query logging
    pool: {
        max: 5, // Maximum number of connections in pool
        min: 0, // Minimum number of connections in pool
        acquire: 30000, // Maximum time (ms) to try to get a connection
        idle: 10000, // Maximum time (ms) a connection can be idle before being released
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1); // Exit the process if the connection fails
    }
};

module.exports = { sequelize, connectDB };