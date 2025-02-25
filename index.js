const express = require('express');
const app = express();
const {createFolder} = require('./controllers/fileController')
app.use(express.json());

app.post('/folder/create',createFolder);

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
