const express = require('express');
const {createFolder} = require('./controllers/folderController');
const {updateFolder} = require('./controllers/folderController');
const {deleteFolder} = require('./controllers/folderController');
const{uploadFiles} = require('./controllers/fileController');
const {upload} = require('./middleware/upload.js');
const {getAllFolders} = require('./controllers/folderController.js');


const app = express();
app.use(express.json());

app.post('/folder/create',createFolder);
app.put('/folders/:folderId',updateFolder);
app.delete('/folders/:folderId',deleteFolder);
app.post('/folders/:folderId/files',upload.single('file'), uploadFiles);
app.get('/folders',getAllFolders);

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
