const multer = require("multer");

// Multer Storage Config
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
    console.log("Multer processing file:", file); // Debugging log

    const allowedMimeTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
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

console.log("Multer initialized");

module.exports = { upload };
