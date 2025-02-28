const express = require('express');
const app = express();
const {createFolder} = require('./controllers/folderController');
const {updateFolder} = require('./controllers/folderController');
const {deleteFolder} = require('./controllers/folderController');
app.use(express.json());

app.post('/folder/create',createFolder);
app.put('/folders/:folderId',updateFolder);
app.delete('/folders/:folderId',deleteFolder);

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
