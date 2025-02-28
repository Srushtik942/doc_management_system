const Folder = require("../models/Folder");

// creating a folder
const createFolder = async(req,res)=>{
    try{
    const {name, type, maxFileLimit} = req.body;
    if(maxFileLimit < 0 || !type ){
        return res.status(400).json({message:"Check request body again!"});
    }

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

// 4.2 Update Folder

const updateFolder = async(req,res)=>{
    try{
    const {folderId} = req.params.folderId;
    const {name,type,maxFileLimit} = req.body;

    if(!name || !type || !maxFileLimit){
        return res.status(400).json({message:"check the request body again, something missing in your body!"});
    }

    const folder = await Folder.findOne(folderId);
    if(!folder){
        return res.status(404).json({message: "Folder not found!"});
    }

    await folder.update({name, type,maxFileLimit});

    res.json({message:"Folder updated successfully!",folder});

}catch(error){
    res.status(500).json({message:"Error updating folder",error});
}


}

module.exports = {createFolder,updateFolder};