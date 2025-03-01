require('dotenv').config();
const { UUIDV4 } = require('sequelize');
const {File} = require('../models/File');
const Folder = require('../models/Folder');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFiles = async(req,res)=>{
    try{
    const {folderId} = req.params;
    const { description} = req.body;
    const file = req.file;
    console.log(req.file);

    if( !description){
        return res.status(400).json({message:"Check your request body again!"});
    }
    const folder = await Folder.findOne({where:{folderId}});

    if(!folder){
        return res.status(404).json({message:"Folder not found!"});
    }

    const fileCount = await File.count({ where: { folderId } });

    if (fileCount === undefined) {
        return res.status(500).json({ message: "Error fetching file count!" });
    }

    if (fileCount >= folder.maxFileLimit) {
        return res.status(400).json({ message: "Folder has reached the max file limit!" });
    }
        const uploadedFile = await File.create({
            fileId: UUIDV4(),
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            folderId,
            file,
            description
        })
         res.status(200).json({message:"File uploaded successfully! ",uploadedFile});

}catch(error){
    return res.status(500).json({message:"Internal Server Error!",error:error.message});
}

}
module.exports ={uploadFiles};