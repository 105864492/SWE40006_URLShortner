
const express = require("express");
const urlRoutes = require("../src/routes/urlRoutes");

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable PORT or default to 3000

app.use(express.json());
app.use(express.static("static")); // Serve static files from the "static" directory

// Register URL API routes
app.use("/api/urls", urlRoutes);

// Health endpoint for DevOps monitoring
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
