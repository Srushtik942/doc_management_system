const { v4: uuidv4 } = require("uuid");
const  File  = require("../models/File");
const Folder = require("../models/Folder");
const { where } = require("sequelize");
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
            description,
        });

        console.log(newFile);

        res.status(200).json({ message: "File uploaded successfully!", newFile });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!", error: error.message });
    }
};

// Update File Description

const updateFileDescription = async(req,res)=>{
    try{
    const {folderId , fileId} = req.params;
    const {description} = req.body;

    if(!folderId || !fileId){
        return res.status(400).json({message:"Check request body again!"});
    }
    if(!description){
        return res.status(400).json({message:"Please check the description"});
    }

    const updatedDescription = await File.update(
        {description},
        {where:{fileId,folderId}}
);

   const updateFile = await File.findOne({where:{folderId, fileId}});


   res.status(200).json({message:"File description updated successfully!",files:{
    files:{
    fileId : fileId,
    description: description
    }
   }});

    }catch(error){
        return res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
}

// Delete the File

const deleteFile = async(req,res)=>{
    try{
    const {folderId, fileId} = req.params;
    if(!folderId || !fileId){
        return res.status(400).json({message:"Check path again!"});
    }
    const destroyFile = await File.destroy({
        where:{folderId, fileId}
    });
    return res.status(200).json({message:"File deleted successfully!",destroyFile});
}catch(error){
  return res.status(500).json({message:"Internal Server Error!",error:error.message});
}
}

// get all the files from particular folder

const getAllFiles = async(req,res)=>{
    try{
        const {folderId} = req.params;
        if(!folderId){
            return res.status(400).json({message:"Check folderId again"});
        }
        const getFile = await File.findAll({where:{folderId}});

        if(getFile.length === 0){
            return res.status(404).json({message:"No files found!"});
        }

        return res.status(200).json({message:"Files fetched successfully!",files: getFile.map((file)=>({
         fileId : file.fileId,
         name : file.name,
         description : file.description,
         size: file.size,
         uploadedAt: file.uploadedAt
        }))
        })

    }catch(error){
        return res.status(500).json({message:"Internal Server Error!", error:error.message});
    }
}

//  Sort Files by Size

const getFileBySort = async(req,res)=>{
    try{
    const {folderId} = req.params;
    const {sort} = req.query;

    if(!folderId){
        return res.status(400).json({message:"check folderId again!"});
    }
    let order = [];

    if(sort === "size"){
      order = [["size","ASC"]];
    }
    else{
        return res.status(400).json({message:"Invalid sort parameter"});
    }

    const sortedFile = await File.findAll({where:{folderId}, order});

    if(sortedFile.length === 0){
        return res.status(404).json({message:"No files found!"});
    }

    return res.status(200).json({message:"Files sorted by size",
        files: sortedFile.map((file)=>({
            fileId: file.fileId,
            name: file.name,
            description : file.description,
            size: file.size,
            uploadedAt: file.uploadedAt

        }))
    });

    }catch(error){
        return res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
}

// sort files by recency
const sortByRecency = async(req,res)=>{
    try{
        const {folderId} = req.params;
        const {sort} = req.query;
        if(!folderId){
            return res.status(400).json({message:"Check the folderId again!"});
        }
        let order = [];
        if(sort === "uploadedAt"){
           order = [["uploadedAt", "ASC"]];
        }else{
            return res.status(400).json({message:"Invalid Sort Parameters!"});
        }
        const sortedFiles = await File.findAll({where:{folderId},order});

        if(sortedFiles.length === 0){
            return res.status(404).json({message:"Files not found!"});
        }
        return res.status(200).json({message:"File sorted by recency",
            files: sortedFiles.map((file)=>({
            fileId: file.fileId,
            name: file.name,
            description : file.description,
            size: file.size,
            uploadedAt: file.uploadedAt

            }))
        });
    }catch(error){
        return res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
}

//  Get Files by Type Across Folders
const getFilesByType = async(req,res)=>{
    try{
    const {type} = req.query;

    if(!type){
        return res.status(400).json({message:"Check type query again!"});
    }
   const fileByType = await File.findAll({where:{type}});
   console.log("fileByType",fileByType);

   return res.status(200).json({message:"Fetching all the files by type" ,
    files: fileByType.map((file)=>({
        fileId: file.fileId,
        folderId : file.folderId,
        name :file.name,
        description : file.description,
        type : file.type,
        size: file.size,
        uploadedAt: file.uploadedAt
    }))
   });

    }catch(error){
        return res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
}

const getFileMetadata = async(req,res)=>{
    try{
        const {folderId} = req.params;

        if(!folderId){
            return res.status(400).json({message:"check your folderId "});
        }

        const fetchMetadata = await File.findAll({where:{folderId}});

        if(!fetchMetadata){
            return res.status(404).json({message:"FolderId is not present!"});
        }

        return res.status(200).json({message:"Metadata fetched successfully!",
            file: fetchMetadata.map((file)=>({
                fileId: file.fileId ,
                name: file.name,
                size: file.size,
                description: file.description
            }))
        });
    }catch(error){
        return res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
}




module.exports = { uploadFiles, updateFileDescription , deleteFile, getAllFiles, getFileBySort, sortByRecency,getFilesByType,getFileMetadata};
