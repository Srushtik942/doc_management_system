const { v4: uuidv4 } = require("uuid"); // Ensure UUID generation
const { File } = require("../models/File");
const Folder = require("../models/Folder");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFiles = async (req, res) => {
    try {
        const { folderId } = req.params;
        const { file, description } = req.body;

        console.log("Received File:", file); // Debugging log

        if (!file || !file.originalname) {
            return res.status(400).json({ message: "No file uploaded or invalid file format!" });
        }

        if (!description) {
            return res.status(400).json({ message: "Check your request body again!" });
        }

        // Validate Folder
        const folder = await Folder.findOne({ where: { folderId } });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found!" });
        }

        // Check File Limit
        const fileCount = await File.count({ where: { folderId } });
        if (fileCount >= folder.maxFileLimit) {
            return res.status(400).json({ message: "Folder has reached the max file limit!" });
        }

        // Upload File to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ message: "Cloudinary Upload Error!", error: error.message });
                }

                // Save File Details to Database
                const uploadedFile = await File.create({
                    fileId: uuidv4(),
                    name: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                    folderId,
                    url: result.secure_url, // Store Cloudinary URL
                    description,
                });

                res.status(200).json({ message: "File uploaded successfully!", uploadedFile });
            }
        );

        cloudinaryResponse.end(file.buffer); // Pass file buffer for upload

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!", error: error.message });
    }
};

module.exports = { uploadFiles };
