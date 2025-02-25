const Folder = require("../models/Folder");

const createFolder = async(req,res)=>{
    try{
    const {name, type, maxFileLimit} = req.body;

    const folder = await Folder.create({
        name,
        type,
        maxFileLimit
    });
    return res.status(200).json({
        message: "Folder created successfully!",
        folder
    });
    }catch(error){
        return res.status(500).json({message:"Internal Server Error!", error: error.message});
    }

}

module.exports = {createFolder};