const multer = require("multer");

// Multer Storage Config
const storage = multer.memoryStorage();

// File Filter (Restrict file types)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("application/")) {
        cb(null, true);
    } else {
        cb(new Error("Only document files are allowed!"), false);
    }
};

// Initialize Multer (Max file size: 10MB)
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = {upload};
