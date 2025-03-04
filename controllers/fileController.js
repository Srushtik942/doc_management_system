const { v4: uuidv4 } = require("uuid");
const  File  = require("../models/File");
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
        const file = req.file;
        const { folderId } = req.params;
        const  { description}  = req.body;

        console.log("Headers:", req.headers);
        console.log("Received File:", req.file);
        console.log("Request Body:", req.body);

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

        // Upload file to Cloudinary without using stream
        const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
        console.log("cloudinaryResponse",cloudinaryResponse);

        // Save File Details to Database
        const newFile = await File.create({
            fileId: uuidv4(),
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            folderId,
            // url: cloudinaryResponse.secure_url, // Store Cloudinary URL
            description,
        });

        console.log(newFile);

        res.status(200).json({ message: "File uploaded successfully!", newFile });


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!", error: error.message });
    }
};

module.exports = { uploadFiles };
